package controllers

import (
	"bytes"
	"github.com/labstack/echo/v4"
	"github.com/mobilusoss/go-s3fs"
	"github.com/mohemohe/parakeet/server/models"
	"github.com/mohemohe/parakeet/server/util"
	"github.com/pkg/errors"
	"io/ioutil"
	"mime"
	"net/http"
	"net/url"
	"path/filepath"
	"strings"
)

type (
	DriveFileCopyRequest struct {
		Operation string `json:"operation"`
		Src       string `json:"src"`
	}
	FileInfo struct {
		Name string `json:"name"`
		Path string `json:"path"`
		Type int    `json:"type"`
		Size int64  `json:"size,omitempty"`
	}
)

func newClient() *s3fs.S3FS {
	kv := models.GetKVS(models.KVAWSS3)
	if kv == nil {
		return nil
	}

	v := new(models.S3)
	if err := util.JsonMapToStruct(kv.Value, v); err != nil {
		return nil
	}

	config := &s3fs.Config{
		Region:          v.Region,
		Bucket:          v.Bucket,
		AccessKeyID:     v.AccessKeyID,
		AccessSecretKey: v.AccessSecretKey,
		Endpoint:        v.Endpoint,
	}

	if config.AccessKeyID == "" || config.AccessSecretKey == "" {
		config.EnableIAMAuth = true
	}
	if config.Endpoint != "" {
		config.EnableMinioCompat = true
	}

	return s3fs.New(config)
}

// @Tags drive
// @Summary list files
// @Description ファイル一覧を取得します
// @Produce json
// @Param path query int false "ドライブのパス" default("/")
// @Success 200 {array} s3fs.FileInfo
// @Router /v1/drive/{path} [get]
func FetchDrive(c echo.Context) error {
	path, err := url.QueryUnescape(c.Param("*"))
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	s3 := newClient()

	if path == "" || strings.HasSuffix(path, "/") {
		list := s3.List(path)
		if list == nil {
			newList := make([]s3fs.FileInfo, 0)
			list = &newList
		}
		return c.JSON(http.StatusOK, list)
	}

	stream, err := s3.Get(path)
	if err != nil {
		return c.String(http.StatusNotFound, err.Error())
	}
	contentType := echo.MIMEOctetStream
	if filepath.Ext(path) == "" {
		buffer, err := ioutil.ReadAll(*stream)
		copyStream := ioutil.NopCloser(bytes.NewBuffer(buffer))
		if err != nil {
			contentType = mime.TypeByExtension(filepath.Ext(path))
		} else {
			contentType = http.DetectContentType(buffer)
		}
		return c.Stream(http.StatusOK, contentType, copyStream)
	} else {
		contentType = mime.TypeByExtension(filepath.Ext(path))
	}
	return c.Stream(http.StatusOK, contentType, *stream)
}

// @Tags drive
// @Summary list files
// @Description ファイルを移動またはコピーします
// @Produce json
// @Param path query int true "ドライブのコピー先パス" default("/")
// @Param Body body DriveFileCopyRequest true "Body"
// @Success 200
// @Router /v1/drive/{path} [put]
func CopyDriveFile(c echo.Context) error {
	body := new(DriveFileCopyRequest)
	if err := c.Bind(body); err != nil {
		return c.String(http.StatusNotAcceptable, err.Error())
	}
	operation := strings.ToLower(body.Operation)

	path, err := url.QueryUnescape(c.Param("*"))
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}
	if path != "" && strings.HasSuffix(path, "/") {
		return c.NoContent(http.StatusBadRequest)
	}

	src := strings.TrimPrefix(body.Src, "/")

	s3 := newClient()

	if operation == "copy" {
		err = s3.Copy(src, path, nil)
	} else if operation == "move" {
		err = s3.Move(src, path)
	} else {
		err = errors.New("malformed request")
	}
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusOK)
}

// @Tags drive
// @Summary delete file(s)
// @Description ファイルを削除します
// @Produce json
// @Param path query int true "ファイル パス" default("/")
// @Success 200
// @Router /v1/drive/{path} [delete]
func DeleteDriveFile(c echo.Context) error {
	path, err := url.QueryUnescape(c.Param("*"))
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}
	if path == "" {
		return c.NoContent(http.StatusBadRequest)
	}

	s3 := newClient()

	err = s3.Delete(path)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusOK)
}

// @Tags drive
// @Summary list files
// @Description ファイルを追加またはフォルダーを作成します
// @Produce json
// @Param path query int true "ドライブの作成先パス" default("/")
// @Success 200
// @Router /v1/drive/{path} [post]
func CreateDriveObject(c echo.Context) error {
	path, err := url.QueryUnescape(c.Param("*"))
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}
	if path == "" {
		return c.NoContent(http.StatusNotAcceptable)
	}
	if strings.HasSuffix(path, "/") {
		return createDriveDir(c, path)
	}
	return createDriveFile(c, path)
}

func createDriveFile(c echo.Context, path string) error {
	extension := filepath.Ext(path)
	contentType := mime.TypeByExtension(extension)

	s3 := newClient()
	if err := s3.Put(path, c.Request().Body, contentType); err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}
	return c.NoContent(http.StatusOK)
}

func createDriveDir(c echo.Context, path string) error {
	s3 := newClient()
	dirPath := strings.TrimSuffix(path, "/")
	if err := s3.MkDir(dirPath); err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}
	return c.NoContent(http.StatusOK)
}

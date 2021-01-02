package controllers

import (
	"bytes"
	"github.com/labstack/echo/v4"
	"github.com/mobilusoss/go-s3fs"
	"github.com/mohemohe/parakeet/server/models"
	"github.com/mohemohe/parakeet/server/util"
	"io/ioutil"
	"mime"
	"net/http"
	"net/url"
	"path/filepath"
	"strings"
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
// @Success 200 {object} []s3fs.FileInfo
// @Router /v1/drive/* [get]
func FetchDrive(c echo.Context) error {
	path, err := url.QueryUnescape(c.Param("*"))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	s3 := newClient()

	if path == "" || strings.HasSuffix(path, "/") {
		list := s3.List(path)
		return c.JSON(http.StatusOK, list)
	}

	stream, err := s3.Get(path)
	if err != nil {
		return c.NoContent(http.StatusNotFound)
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

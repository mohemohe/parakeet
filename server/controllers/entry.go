package controllers

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/globalsign/mgo/bson"
	"github.com/labstack/echo/v4"
	"github.com/mohemohe/parakeet/server/models"
	"github.com/mohemohe/parakeet/server/util"
)

type (
	EntryResponse struct {
		Entry *models.Entry `json:"entry"`
	}
)

// @Tags entry
// @Summary list entries
// @Description エントリー一覧を取得します
// @Produce json
// @Param page query int false "ページネーションのページ数" default(1)
// @Param limit query int false "1ページごとの件数" default(5)
// @Param search query int false "検索クエリー"
// @Success 200 {object} models.Entries
// @Router /v1/entries [get]
func GetEntries(c echo.Context) error {
	limit, err := strconv.Atoi(c.QueryParam("limit"))
	if err != nil {
		limit = 5
	}
	page, err := strconv.Atoi(c.QueryParam("page"))
	if err != nil {
		page = 1
	}
	search := c.QueryParam("search")
	includeDraft := c.Get("User") != nil

	entries := models.GetEntries(limit, page, search, includeDraft)
	if entries == nil {
		panic("db error")
	}
	if !includeDraft {
		for i, _ := range entries.Entries {
			entries.Entries[i].FindCount = nil
		}
	}
	return c.JSON(http.StatusOK, entries)
}

// @Tags entry
// @Summary get entry
// @Description エントリーを取得します
// @Produce json
// @Param id path string true "エントリーの 'Mongo ObjectID'"
// @Success 200 {object} EntryResponse
// @Success 404
// @Router /v1/entries/{id} [get]
func GetEntry(c echo.Context) error {
	id := c.Param("id")
	count := c.Request().Header.Get("X-Parakeet-Count")
	includeDraft := c.Get("User") != nil

	entry := models.GetEntryById(id, includeDraft, !includeDraft || count == "true")
	if entry == nil {
		return c.NoContent(http.StatusNotFound)
	}
	if !includeDraft {
		entry.FindCount = nil
	}
	return c.JSON(http.StatusOK, EntryResponse{
		Entry: entry,
	})
}

// @Tags entry
// @Summary create entry
// @Description エントリーを作成します
// @Produce json
// @Security AccessToken
// @Param Body body models.Entry true "Body"
// @Success 200 {object} EntryResponse
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/entries [post]
func InsertEntry(c echo.Context) error {
	// HACK: swag
	return UpsertEntry(c)
}

// @Tags entry
// @Summary update entry
// @Description エントリーを更新します
// @Produce json
// @Security AccessToken
// @Param id path string true "エントリーの 'Mongo ObjectID'"
// @Param Body body models.Entry true "Body"
// @Success 200 {object} EntryResponse
// @Failure 404
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/entries/{id} [put]
func UpsertEntry(c echo.Context) error {
	entry := new(models.Entry)
	if err := c.Bind(entry); err != nil {
		panic("bind error")
	}
	user := c.Get("User").(*models.User)
	entry.Author = user.ID
	count := 0
	entry.FindCount = &count

	enableNotify := false

	id := c.Param("id")
	if id == "" || id == "undefined" {
		enableNotify = true
	} else {
		current := models.GetEntryById(id, true, false)
		if current != nil {
			entry.ID = current.ID
			entry.Created = current.Created
			if current.FindCount != nil {
				entry.FindCount = current.FindCount
			}
			if current.Draft && !entry.Draft {
				entry.Created = time.Now()
				entry.Modified = time.Time{} // HACK: reset modified
				enableNotify = true
			}
		}
	}

	if err := models.UpsertEntry(entry); err != nil {
		enableNotify = false
		panic(err)
	}

	if entry.Draft {
		enableNotify = false
	}

	if enableNotify {
		mastodon := models.GetKVS(models.KVNotifyMastodon)
		if mastodon != nil {
			notifyMastodon := mastodon.Value.(bson.M)
			if notifyMastodon["baseurl"] != "" && notifyMastodon["token"] != "" && notifyMastodon["template"] != "" {
				status := notifyMastodon["template"].(string)
				status = strings.ReplaceAll(status, "%ENTRY_TITLE%", entry.Title)
				status = strings.ReplaceAll(status, "%ENTRY_URL%", c.Scheme()+"://"+c.Request().Host+"/entry/"+entry.ID.Hex())
				go util.PostMastodon(status, notifyMastodon["baseurl"].(string), notifyMastodon["token"].(string))
			}
		}

		misskey := models.GetKVS(models.KVNotifyMisskey)
		if misskey != nil {
			notifyMisskey := misskey.Value.(bson.M)
			if notifyMisskey["baseurl"] != "" && notifyMisskey["token"] != "" && notifyMisskey["template"] != "" {
				status := notifyMisskey["template"].(string)
				status = strings.ReplaceAll(status, "%ENTRY_TITLE%", entry.Title)
				status = strings.ReplaceAll(status, "%ENTRY_URL%", c.Scheme()+"://"+c.Request().Host+"/entry/"+entry.ID.Hex())
				go util.PostMisskey(status, notifyMisskey["baseurl"].(string), notifyMisskey["token"].(string))
			}
		}
	}

	return c.JSON(http.StatusOK, EntryResponse{
		Entry: entry,
	})
}

// @Tags entry
// @Summary delete entry
// @Description エントリーを削除します
// @Produce json
// @Security AccessToken
// @Param id path string true "エントリーの 'Mongo ObjectID'"
// @Success 200 {object} middlewares.EmptyJson
// @Failure 404
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/entries/{id} [delete]
func DeleteEntry(c echo.Context) error {
	id := c.Param("id")
	entry := models.GetEntryById(id, true, false)
	if entry == nil {
		panic("the user not found")
	}

	if err := models.DeleteEntry(entry); err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, struct{}{})
}

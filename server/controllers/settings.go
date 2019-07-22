package controllers

import (
	"github.com/labstack/echo/v4"
	"github.com/mohemohe/parakeet/server/models"
	"net/http"
)

type (
	Setting struct {
		Key   string      `json:"key"`
		Value interface{} `json:"value"`
	}
)

func GetSiteTitle(c echo.Context) error {
	kv := models.GetKVS("site_title")
	if kv == nil {
		panic("db error")
	}

	return c.JSON(http.StatusOK, kv)
}

func SetSiteTitle(c echo.Context) error {
	reqBody := new(Setting)
	if err := c.Bind(reqBody); err != nil {
		panic("bind error")
	}

	reqBody.Key = "site_title"
	if err := models.SetKVS(reqBody.Key, reqBody.Value); err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, reqBody)
}

func GetNotifyMastodon(c echo.Context) error {
	kv := models.GetKVS("notify_mastodon")
	if kv == nil {
		panic("db error")
	}

	return c.JSON(http.StatusOK, kv)
}

func SetNotifyMastodon(c echo.Context) error {
	reqBody := new(models.NotifyMastodon)
	if err := c.Bind(reqBody); err != nil {
		panic("bind error")
	}

	if err := models.SetKVS("notify_mastodon", reqBody); err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, &models.KV{
		Key:   "notify_mastodon",
		Value: reqBody,
	})
}

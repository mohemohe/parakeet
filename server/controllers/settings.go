package controllers

import (
	"github.com/labstack/echo/v4"
	"github.com/mohemohe/parakeet/server/models"
	"net/http"
)

type (
	Setting struct {
		Key   string `json:"key"`
		Value string `json:"value"`
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

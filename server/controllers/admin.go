package controllers

import (
	"github.com/labstack/echo/v4"
	"github.com/mohemohe/parakeet/server/configs"
	"net/http"
)

type (
	Admin struct {
		Unix int64
	}
)

func AdminIndex(c echo.Context) error {
	return c.Render(http.StatusOK, "admin.html", Admin{
		Unix: configs.GetUnix(),
	})
}

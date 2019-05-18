package controllers

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

func AdminIndex(c echo.Context) error {
	return c.Render(http.StatusOK, "admin/index.html", nil)
}

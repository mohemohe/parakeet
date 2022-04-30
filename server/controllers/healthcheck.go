package controllers

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

// @Tags healthcheck
// @Summary healthcheck
// @Description healthcheck
// @Success 200
// @Router /v1/healthcheck [get]
func GetHealthCheck(c echo.Context) error {
	return c.NoContent(http.StatusOK)
}

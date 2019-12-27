package middlewares

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

func Authorized(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		if c.Get("User") == nil {
			return c.JSON(http.StatusUnauthorized, struct{}{})
		}
		return next(c)
	}
}

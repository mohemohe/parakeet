package middlewares

import (
	"github.com/labstack/echo/v4"
	"github.com/nu7hatch/gouuid"
)

func SetUUID(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		id, _ := uuid.NewV4()
		c.Set("uuid", id)
		return next(c)
	}
}

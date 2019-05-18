package middlewares

import (
	"github.com/labstack/echo/v4"
	"github.com/mohemohe/parakeet/server/util/ssr"
	"net/http"
)

type (
	SSRConfig struct {
		Skipper func(c echo.Context) bool
		Handler http.Handler
	}
)

func SSRWithConfig(config SSRConfig) echo.MiddlewareFunc {
	pool := ssr.NewPool(config.Handler)

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if config.Skipper(c) {
				return next(c)
			}
			return ssr.Handle(c, pool)
		}
	}
}

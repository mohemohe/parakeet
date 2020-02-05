package util

import (
	"github.com/labstack/echo/v4"
	"net/url"
	"path"
)

func BaseURL(c echo.Context) string {
	proto := "http://"
	if c.Request().TLS != nil {
		proto = "https://"
	}
	host := c.Request().Host

	return proto + host
}

func JoinURL(args ...string) string {
	if len(args) == 0 {
		return ""
	}
	base, err := url.Parse(args[0])
	if err != nil {
		return ""
	}
	paths := []string{base.Path}
	paths = append(paths, args[1:]...)

	base.Path = path.Join(paths...)
	return base.String()
}
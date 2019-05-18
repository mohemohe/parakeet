package controllers

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

func ListPosts(c echo.Context) error {
	return c.Render(http.StatusOK, "posts/index.html", nil)
}

func SinglePost(c echo.Context) error {
	return c.Render(http.StatusOK, "posts/post.html", nil)
}

package controllers

import (
	"github.com/labstack/echo/v4"
	"github.com/mohemohe/parakeet/server/models"
	"net/http"
	"time"
)

type (
	AuthRequest struct {
		Name     string `json:"name"`
		Password string `json:"password"`
	}
)

func AuthLogin(c echo.Context) error {
	authRequest := new(AuthRequest)
	if err := c.Bind(authRequest); err != nil {
		panic("bind error")
	}

	_, token := models.AuthroizeUser(authRequest.Name, authRequest.Password)
	if token == nil {
		panic("invalid token")
	}

	cookie := new(http.Cookie)
	cookie.Name = "token"
	cookie.Value = *token
	cookie.Expires = time.Now().Add(24 * time.Hour)
	c.SetCookie(cookie)

	// TODO: redirect

	return c.Render(http.StatusOK, "posts/index.html", nil)
}

func AuthLogout(c echo.Context) error {
	return c.Render(http.StatusOK, "posts/post.html", nil)
}

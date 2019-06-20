package controllers

import (
	"github.com/labstack/echo/v4"
	"github.com/mohemohe/parakeet/server/models"
	"net/http"
)

type (
	AuthRequest struct {
		Name     string `json:"name"`
		Password string `json:"password"`
	}

	AuthResponse struct {
		User  *models.User `json:"user"`
		Token *string      `json:"token"`
	}
)

func AuthLogin(c echo.Context) error {
	authRequest := new(AuthRequest)
	if err := c.Bind(authRequest); err != nil {
		panic("bind error")
	}

	user, token := models.AuthroizeUser(authRequest.Name, authRequest.Password)
	if token == nil {
		panic("invalid token")
	}

	return c.JSON(http.StatusOK, AuthResponse{
		User:  user,
		Token: token,
	})
}

func AuthCheck(c echo.Context) error {
	user := c.Get("User").(*models.User)
	return c.JSON(http.StatusOK, AuthResponse{
		User: user,
	})
}

func AuthLogout(c echo.Context) error {
	return c.Render(http.StatusOK, "admin.html", nil)
}

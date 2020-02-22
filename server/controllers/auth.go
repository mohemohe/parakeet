package controllers

import (
	"github.com/labstack/echo/v4"
	"github.com/mohemohe/parakeet/server/models"
	"net/http"
)

type (
	AuthRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	AuthResponse struct {
		User  *models.User `json:"user"`
		Token *string      `json:"token"`
	}
)

// @Tags auth
// @Summary login
// @Description メールアドレスとパスワードを送信してアクセストークンを取得します
// @Accept json
// @Produce json
// @Param Body body AuthRequest true "Body"
// @Success 200 {object} AuthResponse
// @Router /v1/auth [post]
func AuthLogin(c echo.Context) error {
	authRequest := new(AuthRequest)
	if err := c.Bind(authRequest); err != nil {
		panic("bind error")
	}

	user, token := models.AuthroizeUser(authRequest.Email, authRequest.Password)
	if token == nil {
		panic("invalid token")
	}

	return c.JSON(http.StatusOK, AuthResponse{
		User:  user,
		Token: token,
	})
}

// @Tags auth
// @Summary status
// @Description アクセストークンが有効か判定します
// @Produce json
// @Security AccessToken
// @Success 200 {object} AuthResponse
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/auth [get]
func AuthCheck(c echo.Context) error {
	user := c.Get("User").(*models.User)
	return c.JSON(http.StatusOK, AuthResponse{
		User: user,
	})
}

func AuthLogout(c echo.Context) error {
	return c.Render(http.StatusOK, "admin.html", nil)
}

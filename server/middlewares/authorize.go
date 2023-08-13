package middlewares

import (
	"github.com/golang-jwt/jwt/v4"
	"github.com/golang-jwt/jwt/v4/request"
	"github.com/labstack/echo/v4"
	"github.com/mitchellh/mapstructure"
	"github.com/mohemohe/parakeet/server/configs"
	"github.com/mohemohe/parakeet/server/models"
)

func Authorize(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		token, err := request.ParseFromRequest(c.Request(), request.AuthorizationHeaderExtractor, func(token *jwt.Token) (interface{}, error) {
			b := []byte(configs.GetEnv().Sign.Secret)
			return b, nil
		})
		if err != nil {
			return next(c)
		}

		claims := token.Claims.(jwt.MapClaims)
		tokenUser := new(models.JwtClaims)
		if err := mapstructure.Decode(claims, tokenUser); err != nil {
			return next(c)
		}

		user := models.GetUserByEmail(tokenUser.Email)
		if user == nil {
			return next(c)
		}

		if user.ID.Hex() == tokenUser.ID && user.Email == tokenUser.Email && user.Role == tokenUser.Role {
			c.Set("User", user)
		}

		return next(c)
	}
}

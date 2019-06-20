package controllers

import (
	"github.com/labstack/echo/v4"
	"github.com/mohemohe/parakeet/server/models"
	"net/http"
)

type (
	UserRequest struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	UserResponse struct {
		User  *models.User `json:"user"`
	}
)

func CreateUser(c echo.Context) error {
	reqBody := new(UserRequest)
	if err := c.Bind(reqBody); err != nil {
		panic("bind error")
	}

	if user := models.GetUserByName(reqBody.Name); user != nil {
		panic("the user already registered")
	}

	user := &models.User{
		Name: reqBody.Name,
		Email: reqBody.Email,
		Password: reqBody.Password,
		Role: models.UserRole,
	}
	if err := models.UpsertUser(user); err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, UserResponse{
		User:  user,
	})
}

func UpdateUser(c echo.Context) error {
	reqBody := new(UserRequest)
	if err := c.Bind(reqBody); err != nil {
		panic("bind error")
	}

	user := models.GetUserByName(reqBody.Name)
	if user != nil {
		panic("the user not found")
	}

	nextUser := &models.User{
		Name: user.Name,
		Email: reqBody.Email,
		Password: reqBody.Password,
		Role: user.Role,
	}
	if err := models.UpsertUser(nextUser); err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, UserResponse{
		User:  user,
	})
}

func DeleteUser(c echo.Context) error {
	reqBody := new(UserRequest)
	if err := c.Bind(reqBody); err != nil {
		panic("bind error")
	}

	user := models.GetUserByName(reqBody.Name)
	if user != nil {
		panic("the user not found")
	}

	if err := models.DeleteUser(user); err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, struct{}{})
}
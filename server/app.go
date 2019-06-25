package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/mohemohe/parakeet/server/configs"
	"github.com/mohemohe/parakeet/server/controllers"
	"github.com/mohemohe/parakeet/server/middlewares"
	"github.com/mohemohe/parakeet/server/models"
	"github.com/mohemohe/parakeet/server/templates"
	"github.com/neko-neko/echo-logrus/v2/log"
	"github.com/playree/goingtpl"
	"strings"
)

func main() {
	e := echo.New()
	initEcho(e)
	initTemplate(e)
	go models.InitDB()

	e.Logger.Fatal(e.Start(":1323"))
}

func initEcho(e *echo.Echo) {
	e.Use(middleware.Recover())
	e.Logger = log.Logger()
	e.Use(middleware.Logger())
	if configs.GetEnv().Echo.Env == "debug" {
		e.Logger.SetLevel(0)
	}
	e.Static("/public", "public")
	e.Use(middlewares.SSRWithConfig(middlewares.SSRConfig{
		Skipper: func(c echo.Context) bool {
			return strings.HasPrefix(c.Path(), "/public") || strings.HasPrefix(c.Path(), "/admin") || strings.HasPrefix(c.Path(), "/api") || c.Path() == "/favicon.ico"
		},
		Handler: e,
	}))

	e.GET("/admin", controllers.AdminIndex)

	e.GET("/api/v1/auth", controllers.AuthCheck, middlewares.Authorized)
	e.POST("/api/v1/auth", controllers.AuthLogin)
	e.POST("/api/v1/user", controllers.CreateUser, middlewares.Authorized)
	e.PUT("/api/v1/user/:id", controllers.UpdateUser, middlewares.Authorized)
	e.DELETE("/api/v1/user/:id", controllers.DeleteUser, middlewares.Authorized)
}

func initTemplate(e *echo.Echo) {
	goingtpl.SetBaseDir("./templates")
	goingtpl.EnableCache(configs.GetEnv().Echo.Env != "debug")
	t := &templates.Template{}
	e.Renderer = t
}

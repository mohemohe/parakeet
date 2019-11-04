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
	initEnv()

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
	e.GET("/api/v1/users", controllers.GetUsers, middlewares.Authorized)
	e.POST("/api/v1/users", controllers.CreateUser, middlewares.Authorized)
	e.GET("/api/v1/users/:id", controllers.GetUser, middlewares.Authorized)
	e.PUT("/api/v1/users/:id", controllers.UpdateUser, middlewares.Authorized)
	e.DELETE("/api/v1/users/:id", controllers.DeleteUser, middlewares.Authorized)
	e.GET("/api/v1/entries", controllers.GetEntries)
	e.POST("/api/v1/entries", controllers.UpsertEntry, middlewares.Authorized)
	e.GET("/api/v1/entries/:id", controllers.GetEntry)
	e.PUT("/api/v1/entries/:id", controllers.UpsertEntry, middlewares.Authorized)
	e.DELETE("/api/v1/entries/:id", controllers.DeleteEntry, middlewares.Authorized)
	e.GET("/api/v1/settings/site/title", controllers.GetSiteTitle)
	e.PUT("/api/v1/settings/site/title", controllers.SetSiteTitle, middlewares.Authorized)
	e.GET("/api/v1/settings/site/sidenav", controllers.GetSideNavContents)
	e.PUT("/api/v1/settings/site/sidenav", controllers.SetSideNavContents, middlewares.Authorized)
	e.GET("/api/v1/settings/notify/mastodon", controllers.GetNotifyMastodon, middlewares.Authorized)
	e.PUT("/api/v1/settings/notify/mastodon", controllers.SetNotifyMastodon, middlewares.Authorized)
	e.GET("/api/v1/settings/render/server", controllers.GetServerSideRendering, middlewares.Authorized)
	e.PUT("/api/v1/settings/render/server", controllers.SetServerSideRendering, middlewares.Authorized)
	e.GET("/api/v1/settings/cache/mongodb", controllers.GetMongoDBQueryCache, middlewares.Authorized)
	e.PUT("/api/v1/settings/cache/mongodb", controllers.SetGetMongoDBQueryCache, middlewares.Authorized)
	e.GET("/api/v1/settings/cache/page", controllers.GetSSRPageCache, middlewares.Authorized)
	e.PUT("/api/v1/settings/cache/page", controllers.SetSSRPageCache, middlewares.Authorized)
}

func initTemplate(e *echo.Echo) {
	goingtpl.SetBaseDir("./templates")
	goingtpl.EnableCache(configs.GetEnv().Echo.Env != "debug")
	t := &templates.Template{}
	e.Renderer = t
}

func initEnv() {
	_ = configs.GetEnv()
	_ = configs.GetUnix()
}

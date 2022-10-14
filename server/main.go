package main

import (
	"net/http"
	"strings"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/mohemohe/parakeet/server/configs"
	"github.com/mohemohe/parakeet/server/controllers"
	"github.com/mohemohe/parakeet/server/middlewares"
	"github.com/mohemohe/parakeet/server/models"
	"github.com/mohemohe/parakeet/server/templates"
	"github.com/neko-neko/echo-logrus/v2/log"
	"github.com/playree/goingtpl"
	echoSwagger "github.com/swaggo/echo-swagger"

	_ "github.com/mohemohe/parakeet/server/docs"
)

// @title parakeet REST API
// @version 1.0 Draft
// @description ### Fast weblog built in golang and top of echo. supports React SSR and hydrate.
// @description labstack/echoを使った高速なブログエンジン。
// @description Reactのサーバーサイドレンダリングとクライアントサイドの引き継ぎを実装。
// @description （ぶっちゃけ速いかと言われるとSSR有効時はそうでもない）
// @license.name WTFPL
// @license.url https://github.com/mohemohe/parakeet/blob/master/LICENSE
// @BasePath /api
// @securityDefinitions.apikey AccessToken
// @in header
// @name Authorization
func main() {
	initEnv()

	e := echo.New()
	initEcho(e)
	initTemplate(e)
	go models.InitDB()

	e.Logger.Fatal(e.Start(":1323"))
}

func initEcho(e *echo.Echo) {
	e.HideBanner = true

	e.Use(middleware.Recover())
	e.Logger = log.Logger()
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{Skipper: func(c echo.Context) bool {
		return c.Path() == "/api/v1/healthcheck"
	}}))
	e.Use(middleware.CORS())
	if configs.GetEnv().Echo.Env == "debug" {
		e.Logger.SetLevel(0)
	}

	e.Static("/public", "public")
	if configs.GetEnv().Echo.SSR {
		e.Logger.Info("enable SSR and static file hosting")
		e.Use(middlewares.SSRWithConfig(middlewares.SSRConfig{
			Skipper: func(c echo.Context) bool {
				return strings.HasPrefix(c.Path(), "/public") || strings.HasPrefix(c.Path(), "/admin") || strings.HasPrefix(c.Path(), "/api") || strings.HasPrefix(c.Path(), "/swagger") || c.Path() == "/favicon.ico"
			},
			Handler: e,
		}))
		e.GET("/admin", controllers.AdminIndex)
	} else {
		e.Logger.Info("disable SSR")
	}

	e.GET("/api/v1/healthcheck", controllers.GetHealthCheck)
	e.GET("/api/v1/auth", controllers.AuthCheck, middlewares.Authorize, middlewares.Authorized)
	e.POST("/api/v1/auth", controllers.AuthLogin)
	e.GET("/api/v1/users", controllers.GetUsers, middlewares.Authorize, middlewares.Authorized)
	e.POST("/api/v1/users", controllers.CreateUser, middlewares.Authorize, middlewares.Authorized)
	e.GET("/api/v1/users/:id", controllers.GetUser, middlewares.Authorize, middlewares.Authorized)
	e.PUT("/api/v1/users/:id", controllers.UpdateUser, middlewares.Authorize, middlewares.Authorized)
	e.DELETE("/api/v1/users/:id", controllers.DeleteUser, middlewares.Authorize, middlewares.Authorized)
	e.GET("/api/v1/entries", controllers.GetEntries, middlewares.Authorize)
	e.POST("/api/v1/entries", controllers.UpsertEntry, middlewares.Authorize, middlewares.Authorized)
	e.GET("/api/v1/entries/:id", controllers.GetEntry, middlewares.Authorize)
	e.PUT("/api/v1/entries/:id", controllers.UpsertEntry, middlewares.Authorize, middlewares.Authorized)
	e.DELETE("/api/v1/entries/:id", controllers.DeleteEntry, middlewares.Authorize, middlewares.Authorized)
	e.GET("/api/v1/settings/site/title", controllers.GetSiteTitle)
	e.PUT("/api/v1/settings/site/title", controllers.SetSiteTitle, middlewares.Authorize, middlewares.Authorized)
	e.GET("/api/v1/settings/site/sidenav", controllers.GetSideNavContents)
	e.PUT("/api/v1/settings/site/sidenav", controllers.SetSideNavContents, middlewares.Authorize, middlewares.Authorized)
	e.GET("/api/v1/settings/notify/mastodon", controllers.GetNotifyMastodon, middlewares.Authorize, middlewares.Authorized)
	e.PUT("/api/v1/settings/notify/mastodon", controllers.SetNotifyMastodon, middlewares.Authorize, middlewares.Authorized)
	e.GET("/api/v1/settings/notify/misskey", controllers.GetNotifyMisskey, middlewares.Authorize, middlewares.Authorized)
	e.PUT("/api/v1/settings/notify/misskey", controllers.SetNotifyMisskey, middlewares.Authorize, middlewares.Authorized)
	e.GET("/api/v1/settings/render/server", controllers.GetServerSideRendering, middlewares.Authorize, middlewares.Authorized)
	e.PUT("/api/v1/settings/render/server", controllers.SetServerSideRendering, middlewares.Authorize, middlewares.Authorized)
	e.GET("/api/v1/settings/cache/page", controllers.GetSSRPageCache, middlewares.Authorize, middlewares.Authorized)
	e.PUT("/api/v1/settings/cache/page", controllers.SetSSRPageCache, middlewares.Authorize, middlewares.Authorized)
	e.GET("/api/v1/settings/cache/cloudflare", controllers.GetCloudflare, middlewares.Authorize, middlewares.Authorized)
	e.PUT("/api/v1/settings/cache/cloudflare", controllers.SetCloudflare, middlewares.Authorize, middlewares.Authorized)
	e.GET("/api/v1/settings/style/custom", controllers.GetCustomCSS)
	e.PUT("/api/v1/settings/style/custom", controllers.SetCustomCSS, middlewares.Authorize, middlewares.Authorized)
	e.GET("/api/v1/settings/search/mongodb", controllers.GetMongoDBSearch)
	e.PUT("/api/v1/settings/search/mongodb", controllers.SetMongoDBSearch, middlewares.Authorize, middlewares.Authorized)
	e.GET("/api/v1/settings/aws/s3", controllers.GetAWSS3, middlewares.Authorize, middlewares.Authorized)
	e.PUT("/api/v1/settings/aws/s3", controllers.SetAWSS3, middlewares.Authorize, middlewares.Authorized)
	e.GET("/api/v1/drive/*", controllers.FetchDrive)
	e.POST("/api/v1/drive/*", controllers.CreateDriveObject, middlewares.Authorize, middlewares.Authorized)
	e.PUT("/api/v1/drive/*", controllers.CopyDriveFile, middlewares.Authorize, middlewares.Authorized)
	e.DELETE("/api/v1/drive/*", controllers.DeleteDriveFile, middlewares.Authorize, middlewares.Authorized)

	e.GET("/swagger", func(c echo.Context) error {
		return c.Redirect(http.StatusFound, "/swagger/index.html")
	})
	e.GET("/swagger/", func(c echo.Context) error {
		return c.Redirect(http.StatusFound, "/swagger/index.html")
	})
	e.GET("/swagger/*", echoSwagger.WrapHandler)
}

func initTemplate(e *echo.Echo) {
	goingtpl.SetBaseDir("./templates")
	goingtpl.EnableCache(configs.GetEnv().Echo.Env != "debug")
	t := &templates.Template{}
	e.Renderer = t
}

func initEnv() {
	_ = godotenv.Load()
	_ = configs.GetEnv()
	_ = configs.GetUnix()
}

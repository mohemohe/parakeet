package controllers

import (
	"github.com/labstack/echo/v4"
	"github.com/mohemohe/parakeet/server/models"
	"github.com/mohemohe/parakeet/server/util"
	"net/http"
)

type (
	Setting struct {
		Key   string      `json:"key"`
		Value interface{} `json:"value"`
	}
)

// @Tags setting
// @Summary get site title
// @Description サイト名を取得します
// @Produce json
// @Success 200 {object} models.KV
// @Router /v1/settings/site/title [get]
func GetSiteTitle(c echo.Context) error {
	kv := models.GetKVS(models.KVSiteTitle)
	if kv == nil {
		panic("db error")
	}

	return c.JSON(http.StatusOK, kv)
}

// @Tags setting
// @Summary set site title
// @Description サイト名を設定します
// @Produce json
// @Security AccessToken
// @Param Body body Setting true "Body"
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/site/title [put]
func SetSiteTitle(c echo.Context) error {
	reqBody := new(Setting)
	if err := c.Bind(reqBody); err != nil {
		panic("bind error")
	}

	reqBody.Key = models.KVSiteTitle
	if err := models.SetKVS(reqBody.Key, reqBody.Value); err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, reqBody)
}

// @Tags setting
// @Summary get mastodon notification
// @Description Mastodonの通知設定を取得します
// @Produce json
// @Security AccessToken
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/notify/mastodon [get]
func GetNotifyMastodon(c echo.Context) error {
	kv := models.GetKVS(models.KVNotifyMastodon)
	if kv == nil {
		panic("db error")
	}

	return c.JSON(http.StatusOK, kv)
}

// @Tags setting
// @Summary set mastodon notification
// @Description Mastodonの通知設定を更新します
// @Produce json
// @Security AccessToken
// @Param Body body models.NotifyMastodon true "Body"
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/notify/mastodon [put]
func SetNotifyMastodon(c echo.Context) error {
	reqBody := new(models.NotifyMastodon)
	if err := c.Bind(reqBody); err != nil {
		panic("bind error")
	}

	if err := models.SetKVS(models.KVNotifyMastodon, reqBody); err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, &models.KV{
		Key:   models.KVNotifyMastodon,
		Value: reqBody,
	})
}

// @Tags setting
// @Summary get misskey notification
// @Description Misskeyの通知設定を取得します
// @Produce json
// @Security AccessToken
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/notify/misskey [get]
func GetNotifyMisskey(c echo.Context) error {
	kv := models.GetKVS(models.KVNotifyMisskey)
	if kv == nil {
		panic("db error")
	}

	return c.JSON(http.StatusOK, kv)
}

// @Tags setting
// @Summary set misskey notification
// @Description Misskeyの通知設定を更新します
// @Produce json
// @Security AccessToken
// @Param Body body models.NotifyMisskey true "Body"
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/notify/misskey [put]
func SetNotifyMisskey(c echo.Context) error {
	reqBody := new(models.NotifyMastodon)
	if err := c.Bind(reqBody); err != nil {
		panic("bind error")
	}

	if err := models.SetKVS(models.KVNotifyMisskey, reqBody); err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, &models.KV{
		Key:   models.KVNotifyMisskey,
		Value: reqBody,
	})
}

// @Tags setting
// @Summary get SSR
// @Description サーバーサイドレンダリングの設定を取得します
// @Produce json
// @Security AccessToken
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/render/server [get]
func GetServerSideRendering(c echo.Context) error {
	kv := models.GetKVS(models.KVServerSideRendering)
	if kv == nil {
		panic("db error")
	}

	return c.JSON(http.StatusOK, kv)
}

// @Tags setting
// @Summary set SSR
// @Description サーバーサイドレンダリングの設定を更新します
// @Produce json
// @Security AccessToken
// @Param Body body models.ServerSideRendering true "Body"
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/render/server [put]
func SetServerSideRendering(c echo.Context) error {
	reqBody := new(models.ServerSideRendering)
	if err := c.Bind(reqBody); err != nil {
		panic("bind error")
	}

	if err := models.SetKVS(models.KVServerSideRendering, reqBody); err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, &models.KV{
		Key:   models.KVServerSideRendering,
		Value: reqBody,
	})
}

// @Tags setting
// @Summary get MongoDB query cache
// @Description MongoDB クエリーのキャッシュ設定を取得します
// @Produce json
// @Security AccessToken
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/cache/mongodb [get]
func GetMongoDBQueryCache(c echo.Context) error {
	kv := models.GetKVS(models.KVEnableMongoDBQueryCache)
	if kv == nil {
		panic("db error")
	}
	return c.JSON(http.StatusOK, kv)
}

// @Tags setting
// @Summary set MongoDB query cache
// @Description MongoDB クエリーのキャッシュ設定を更新します
// @Produce json
// @Security AccessToken
// @Param Body body models.KV true "Body"
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/cache/mongodb [put]
func SetGetMongoDBQueryCache(c echo.Context) error {
	reqBody := new(models.KV)
	if err := c.Bind(reqBody); err != nil {
		panic("bind error")
	}

	enabled := reqBody.Value.(bool)

	if err := models.SetKVS(models.KVEnableMongoDBQueryCache, enabled); err != nil {
		panic(err)
	}

	if !enabled {
		models.PurgeCache()
	}

	return c.JSON(http.StatusOK, &models.KV{
		Key:   models.KVEnableMongoDBQueryCache,
		Value: reqBody.Value,
	})
}

// @Tags setting
// @Summary get SSR-ed page cache
// @Description サーバーサイドレンダリングで生成したHTMLのキャッシュ設定を取得します
// @Produce json
// @Security AccessToken
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/cache/page [get]
func GetSSRPageCache(c echo.Context) error {
	kv := models.GetKVS(models.KVEnableSSRPageCache)
	if kv == nil {
		panic("db error")
	}
	return c.JSON(http.StatusOK, kv)
}

// @Tags setting
// @Summary set SSR-ed page cache
// @Description サーバーサイドレンダリングで生成したHTMLのキャッシュ設定を更新します
// @Produce json
// @Security AccessToken
// @Param Body body models.KV true "Body"
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/cache/page [put]
func SetSSRPageCache(c echo.Context) error {
	reqBody := new(models.KV)
	if err := c.Bind(reqBody); err != nil {
		panic("bind error")
	}

	enabled := reqBody.Value.(bool)

	if err := models.SetKVS(models.KVEnableSSRPageCache, enabled); err != nil {
		panic(err)
	}

	if !enabled {
		models.PurgeCache()
	}

	return c.JSON(http.StatusOK, &models.KV{
		Key:   models.KVEnableSSRPageCache,
		Value: reqBody.Value,
	})
}

// @Tags setting
// @Summary get side nav contents
// @Description サイドバー コンテンツの設定を取得します
// @Produce json
// @Security AccessToken
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/site/sidenav [get]
func GetSideNavContents(c echo.Context) error {
	kv := models.GetKVS(models.KVSideNavContents)
	if kv == nil {
		panic("db error")
	}
	return c.JSON(http.StatusOK, kv)
}

// @Tags setting
// @Summary set side nav contents
// @Description サイドバー コンテンツの設定を更新します
// @Produce json
// @Security AccessToken
// @Param Body body models.KV true "Body"
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/site/sidenav [put]
func SetSideNavContents(c echo.Context) error {
	reqBody := new(models.KV)
	if err := c.Bind(reqBody); err != nil {
		panic("bind error")
	}

	value := reqBody.Value.([]interface{})

	if err := models.SetKVS(models.KVSideNavContents, value); err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, &models.KV{
		Key:   models.KVEnableSSRPageCache,
		Value: reqBody.Value,
	})
}

// @Tags setting
// @Summary get Cloudflare purge info
// @Description Cloudflareのキャッシュ削除設定を取得します
// @Produce json
// @Security AccessToken
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/cache/cloudflare [get]
func GetCloudflare(c echo.Context) error {
	kv := models.GetKVS(models.KVCloudflare)
	if kv == nil {
		panic("db error")
	}

	return c.JSON(http.StatusOK, kv)
}

// @Tags setting
// @Summary set Cloudflare purge info
// @Description Cloudflareのキャッシュ削除設定を更新します
// @Produce json
// @Security AccessToken
// @Param Body body models.Cloudflare true "Body"
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/cache/cloudflare [put]
func SetCloudflare(c echo.Context) error {
	reqBody := new(models.Cloudflare)
	if err := c.Bind(reqBody); err != nil {
		panic("bind error")
	}

	if err := models.SetKVS(models.KVCloudflare, util.StructToJsonMap(reqBody)); err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, &models.KV{
		Key:   models.KVCloudflare,
		Value: reqBody,
	})
}

// @Tags setting
// @Summary get custom style
// @Description カスタムCSSを取得します
// @Produce text/css
// @Success 200
// @Router /v1/settings/style/custom [get]
func GetCustomCSS(c echo.Context) error {
	kv := models.GetKVS(models.KVCustomCSS)
	if kv == nil {
		panic("db error")
	}

	res := c.Response()
	res.Status = http.StatusOK
	res.Header().Set("Content-Type", "text/css")
	_, err :=  res.Write([]byte(kv.Value.(string)))
	return err
}

// @Tags setting
// @Summary set custom style
// @Description カスタムCSSを設定します
// @Produce json
// @Security AccessToken
// @Param Body body Setting true "Body"
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/style/custom [put]
func SetCustomCSS(c echo.Context) error {
	reqBody := new(Setting)
	if err := c.Bind(reqBody); err != nil {
		panic("bind error")
	}

	if err := models.SetKVS(models.KVCustomCSS, reqBody.Value); err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, &models.KV{
		Key:   models.KVCustomCSS,
		Value: reqBody.Value,
	})
}

// @Tags setting
// @Summary get mongodb regex search
// @Description MongoDBの検索設定を取得します
// @Produce json
// @Success 200
// @Router /v1/settings/search/mongodb [get]
func GetMongoDBSearch(c echo.Context) error {
	kv := models.GetKVS(models.KVMongoDBSearch)
	if kv == nil {
		panic("db error")
	}

	return c.String(http.StatusOK, kv.Value.(string))
}

// @Tags setting
// @Summary set mongodb regex search
// @Description MongoDBの検索設定を設定します
// @Produce json
// @Security AccessToken
// @Param Body body Setting true "Body"
// @Success 200 {object} models.KV
// @Failure 401 {object} middlewares.EmptyJson
// @Router /v1/settings/search/mongodb [put]
func SetMongoDBSearch(c echo.Context) error {
	reqBody := new(Setting)
	if err := c.Bind(reqBody); err != nil {
		panic("bind error")
	}

	if err := models.SetKVS(models.KVMongoDBSearch, reqBody.Value); err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, &models.KV{
		Key:   models.KVCustomCSS,
		Value: reqBody,
	})
}
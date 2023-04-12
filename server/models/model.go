package models

import (
	"context"

	"github.com/mohemohe/parakeet/server/configs"
	"github.com/mohemohe/parakeet/server/models/connection"
	"github.com/mohemohe/parakeet/server/util"
	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var collections = struct {
	Entries string
	Users   string
	KVS     string
}{
	Entries: "entries",
	Users:   "users",
	KVS:     "kvs",
}

type (
	NotifyMastodon struct {
		BaseURL  string `json:"baseurl"`
		Token    string `json:"token"`
		Template string `json:"template"`
	}
	NotifyMisskey struct {
		BaseURL  string `json:"baseurl"`
		Token    string `json:"token"`
		Template string `json:"template"`
	}
	ServerSideRendering struct {
		Entries bool    `json:"entries"`
		Entry   bool    `json:"entry"`
		Timeout float64 `json:"timeout"`
	}
	Cloudflare struct {
		Enable   bool   `json:"enable"`
		ZoneID   string `json:"zone_id"`
		APIToken string `json:"api_token"`
	}
	S3 struct {
		Region          string `json:"region"`
		Bucket          string `json:"bucket"`
		AccessKeyID     string `json:"access_key_id"`
		AccessSecretKey string `json:"access_secret_key"`
		Endpoint        string `json:"endpoint"`
	}
	PaginationInfo struct {
		Current       int `json:"current"`
		TotalPages    int `json:"totalPages"`
		PerPage       int `json:"perPage"`
		TotalRecords  int `json:"totalRecords"`
		RecordsOnPage int `json:"recordsOnPage"`
	}
)

const (
	KVCacheSize           = "cache_size" // TODO:
	KVEnableSSRPageCache  = "ssr_page_cache"
	KVSideNavContents     = "side_nav_contents"
	KVSiteTitle           = "site_title"
	KVNotifyMastodon      = "notify_mastodon"
	KVNotifyMisskey       = "notify_misskey"
	KVServerSideRendering = "server_side_rendering"
	KVCloudflare          = "cloudflare"
	KVCustomCSS           = "custom_css"
	KVMongoDBSearch       = "mongodb_search"
	KVAWSS3               = "aws_s3"
)

func InitDB() {
	ensureIndex(collections.KVS, getIndex([]string{"key"}, true, false))
	ensureIndex(collections.Entries, getIndex([]string{"draft"}, false, true))

	setDefaultConfig(KVSiteTitle, "parakeet")
	setDefaultConfig(KVSideNavContents, []string{})
	setDefaultConfig(KVNotifyMastodon, util.StructToJsonMap(NotifyMastodon{
		BaseURL:  "",
		Token:    "",
		Template: "ブログを書きました: %ENTRY_TITLE% %ENTRY_URL%",
	}))
	setDefaultConfig(KVNotifyMisskey, util.StructToJsonMap(NotifyMisskey{
		BaseURL:  "",
		Token:    "",
		Template: "ブログを書きました: %ENTRY_TITLE% %ENTRY_URL%",
	}))
	setDefaultConfig(KVServerSideRendering, util.StructToJsonMap(ServerSideRendering{
		Entries: true,
		Entry:   true,
		Timeout: 3000,
	}))
	setDefaultConfig(KVEnableSSRPageCache, false)
	setDefaultConfig(KVCloudflare, util.StructToJsonMap(Cloudflare{
		Enable:   false,
		ZoneID:   "",
		APIToken: "",
	}))
	setDefaultConfig(KVCustomCSS, "")
	setDefaultConfig(KVMongoDBSearch, "")
	setDefaultConfig(KVAWSS3, util.StructToJsonMap(S3{
		Region:          "",
		Bucket:          "",
		AccessKeyID:     "",
		AccessSecretKey: "",
		Endpoint:        "",
	}))

	user := GetUserByEmail("root")
	if user == nil {
		err := UpsertUser(&User{
			Name:     "root",
			Email:    "root",
			Password: configs.GetEnv().Root.Password,
			Role:     RootRole,
		})
		if err != nil {
			util.Logger().WithFields(logrus.Fields{
				"error": err,
			}).Warn("could not create root user")
		}
	}

	util.Logger().Info("DB initialized")
}

func getIndex(key []string, unique bool, sparse bool) mongo.IndexModel {
	keys := bson.D{}
	for _, k := range key {
		keys = append(keys, bson.E{Key: k, Value: 1})
	}
	return mongo.IndexModel{
		Keys: keys,
		Options: &options.IndexOptions{
			Unique:     &unique,
			Sparse:     &sparse,
			Background: connection.TruePtr,
		},
	}
}

func ensureIndex(collection string, index mongo.IndexModel) {
	util.Logger().WithFields(logrus.Fields{
		"collection": collection,
		"index":      index,
	}).Debug("create index")
	if _, err := connection.Mongo().Collection(collection).Indexes().CreateOne(context.TODO(), index); err != nil {
		util.Logger().WithFields(logrus.Fields{
			"collection": collection,
			"index":      index,
			"error":      err,
		}).Warn("index create error")
	}
}

func setDefaultConfig(key string, value interface{}) {
	if val := GetKVS(key); val == nil || val.Value == nil {
		log := util.Logger().WithFields(logrus.Fields{
			"key":   key,
			"value": value,
		})
		if err := SetKVS(key, value); err == nil {
			log.Info("set default config")
		} else {
			log.Fatal("error set config")
		}
	}
}

func ObjectIdHex(id string) bson.M {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil
	}
	return bson.M{"_id": objID}
}

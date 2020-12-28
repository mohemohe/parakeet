package models

import (
	"github.com/globalsign/mgo"
	"github.com/mohemohe/mgo-pubsub"
	"github.com/mohemohe/parakeet/server/configs"
	"github.com/mohemohe/parakeet/server/models/connection"
	"github.com/mohemohe/parakeet/server/util"
	"github.com/sirupsen/logrus"
)

var collections = struct {
	PubSub  string
	Entries string
	Users   string
	KVS     string
}{
	PubSub:  "pubsub",
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
		Entries bool `json:"entries"`
		Entry   bool `json:"entry"`
	}
	Cloudflare struct {
		Enable   bool   `json:"enable"`
		ZoneID   string `json:"zone_id"`
		APIToken string `json:"api_token"`
	}
)

const (
	KVCacheSize               = "cache_size" // TODO:
	KVEnableMongoDBQueryCache = "mongo_db_query_cache"
	KVEnableSSRPageCache      = "ssr_page_cache"
	KVSideNavContents         = "side_nav_contents"
	KVSiteTitle               = "site_title"
	KVNotifyMastodon          = "notify_mastodon"
	KVNotifyMisskey           = "notify_misskey"
	KVServerSideRendering     = "server_side_rendering"
	KVCloudflare              = "cloudflare"
)

var pubsub *mgo_pubsub.PubSub

func InitDB() {
	ensureIndex(collections.KVS, getIndex([]string{"key"}, true, false))
	ensureIndex(collections.Entries, getIndex([]string{"draft"}, false, true))

	if p, err := mgo_pubsub.NewPubSub(configs.GetEnv().Mongo.Address, configs.GetEnv().Mongo.Database, "pubsub"); err != nil {
		util.Logger().WithField("error", err).Fatalln("pubsub connection error")
	} else {
		pubsub = p
	}

	if err := pubsub.Initialize(); err != nil {
		util.Logger().WithField("error", err).Fatalln("pubsub initialize error")
	}
	go pubsub.StartPubSub()

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
	}))
	setDefaultConfig(KVEnableMongoDBQueryCache, true)
	setDefaultConfig(KVEnableSSRPageCache, false)
	setDefaultConfig(KVCloudflare, util.StructToJsonMap(Cloudflare{
		Enable:   false,
		ZoneID:   "",
		APIToken: "",
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

	go subscribePurgeCacheEvent()

	util.Logger().Info("DB initialized")
}

func getIndex(key []string, unique bool, sparse bool) mgo.Index {
	return mgo.Index{
		Key:        key,
		Unique:     unique,
		Sparse:     sparse,
		Background: true,
	}
}

func ensureIndex(collection string, index mgo.Index) {
	util.Logger().WithFields(logrus.Fields{
		"collection": collection,
		"index":      index,
	}).Debug("create index")
	if err := connection.Mongo().Collection(collection).Collection().EnsureIndex(index); err != nil {
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

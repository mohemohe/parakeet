package models

import (
	"github.com/globalsign/mgo"
	"github.com/mohemohe/parakeet/server/configs"
	"github.com/mohemohe/parakeet/server/models/connection"
	"github.com/mohemohe/parakeet/server/util"
	"github.com/sirupsen/logrus"
	"strings"
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
)

func InitDB() {
	ensureIndex(collections.KVS, getIndex([]string{"key"}, true, false))

	if err := InitPubSub(); err == nil {
		go StartPubSub()
	} else {
		if strings.HasSuffix(err.Error(), "already exists") {
			go StartPubSub()
		} else {
			util.Logger().Error(err)
		}
	}

	setDefaultConfig("site_title", "parakeet")
	setDefaultConfig("notify_mastodon", NotifyMastodon{
		BaseURL:  "",
		Token:    "",
		Template: "ブログを書きました: %ENTRY_TITLE% %ENTRY_URL%",
	})

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

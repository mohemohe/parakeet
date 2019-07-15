package models

import (
	"github.com/mohemohe/parakeet/server/configs"
	"github.com/mohemohe/parakeet/server/util"
	"github.com/sirupsen/logrus"
	"strings"
)

var collections = struct {
	PubSub string
	Posts  string
	Users  string
}{
	PubSub: "pubsub",
	Posts:  "posts",
	Users:  "users",
}

func InitDB() {
	if err := InitPubSub(); err == nil {
		go StartPubSub()
	} else {
		if strings.HasSuffix(err.Error(), "already exists") {
			go StartPubSub()
		} else {
			util.Logger().Error(err)
		}
	}

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

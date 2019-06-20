package models

import (
	"github.com/mohemohe/parakeet/server/configs"
	"github.com/mohemohe/parakeet/server/util"
	"github.com/sirupsen/logrus"
)

var collections = struct {
	Posts string
	Users string
}{
	Posts: "posts",
	Users: "users",
}

func InitDB() {
	user := GetUserByName("root")
	if user == nil {
		err := UpsertUser(&User{
			Name:     "root",
			Email:    "",
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

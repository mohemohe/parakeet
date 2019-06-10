package models

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/globalsign/mgo/bson"
	"github.com/go-bongo/bongo"
	"github.com/mohemohe/parakeet/server/configs"
	"github.com/mohemohe/parakeet/server/models/connection"
	"github.com/mohemohe/parakeet/server/util"
	"time"
)

type (
	User struct {
		bongo.DocumentBase `bson:",inline"`
		Name               string `bson:"name" json:"name"`
		Password           string `bson:"password" json:"-"`
		Role               int    `bson:"role" json:"role"`
	}

	JwtClaims struct {
		ID   string `json:"id"`
		Name string `json:"name"`
		Role int    `json:"role"`
		jwt.StandardClaims
	}
)

const (
	RootRole = iota + 1
	AdminRole
)

const (
	Name = "name"
)

func GetUserByName(name string) *User {
	conn := connection.Mongo()

	user := &User{}
	err := conn.Collection(collections.Users).FindOne(bson.M{
		Name: name,
	}, user)
	if err != nil {
		return nil
	}

	return user
}

func UpsertUser(user *User) error {
	if !util.IsBcrypt(user.Password) {
		user.Password = *util.Bcrypt(user.Password)
	}
	return connection.Mongo().Collection(collections.Users).Save(user)
}

func DeleteUser(user *User) error {
	return connection.Mongo().Collection(collections.Users).DeleteDocument(user)
}

func AuthroizeUser(username string, password string) (*User, *string) {
	user := GetUserByName(username)
	if user == nil {
		panic("user not found")
	}

	if !util.CompareHash(password, user.Password) {
		panic("wrong password")
	}

	claims := &JwtClaims{
		user.GetId().Hex(),
		user.Name,
		user.Role,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ts, err := token.SignedString([]byte(configs.GetEnv().Sign.Secret))
	if err != nil {
		panic("couldnt create token")
	}

	return user, &ts
}

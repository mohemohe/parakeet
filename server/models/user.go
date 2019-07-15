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
		Email              string `bson:"email" json:"email"`
		Password           string `bson:"password" json:"-"`
		Role               int    `bson:"role" json:"role"`
	}

	Users struct {
		Info  *bongo.PaginationInfo `bson:"-" json:"info"`
		Users []User                `bson:"-" json:"users"`
	}

	JwtClaims struct {
		ID    string `json:"id"`
		Email string `json:"email"`
		Role  int    `json:"role"`
		jwt.StandardClaims
	}
)

const (
	RootRole = iota + 1
	UserRole
)

const (
	Email = "email"
)

func GetUserById(id string) *User {
	conn := connection.Mongo()

	user := &User{}
	err := conn.Collection(collections.Users).FindById(bson.ObjectIdHex(id), user)
	if err != nil {
		return nil
	}

	return user
}

func GetUserByEmail(email string) *User {
	conn := connection.Mongo()

	user := &User{}
	err := conn.Collection(collections.Users).FindOne(bson.M{
		Email: email,
	}, user)
	if err != nil {
		return nil
	}

	return user
}

func GetUsers(perPage int, page int) *Users {
	conn := connection.Mongo()

	result := conn.Collection(collections.Users).Find(bson.M{})
	if result == nil {
		return nil
	}
	info, err := result.Paginate(perPage, page)
	if err != nil {
		return nil
	}
	users := make([]User, info.RecordsOnPage)
	for i := 0; i < info.RecordsOnPage; i++ {
		_ = result.Next(&users[i])
	}

	return &Users{
		Info:  info,
		Users: users,
	}
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

func AuthroizeUser(email string, password string) (*User, *string) {
	user := GetUserByEmail(email)
	if user == nil {
		panic("user not found")
	}

	if !util.CompareHash(password, user.Password) {
		panic("wrong password")
	}

	claims := &JwtClaims{
		user.GetId().Hex(),
		user.Email,
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

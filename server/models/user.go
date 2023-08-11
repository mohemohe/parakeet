package models

import (
	"context"
	"math"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/mohemohe/parakeet/server/configs"
	"github.com/mohemohe/parakeet/server/models/connection"
	"github.com/mohemohe/parakeet/server/util"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type (
	User struct {
		ID       *primitive.ObjectID `bson:"_id" json:"_id"`
		Created  time.Time           `bson:"_created" json:"_created"`
		Modified time.Time           `bson:"_modified" json:"_modified"`

		Name     string `bson:"name" json:"name"`
		Email    string `bson:"email" json:"email"`
		Password string `bson:"password" json:"-"`
		Role     int    `bson:"role" json:"role"`
	}

	Users struct {
		Info  *PaginationInfo `bson:"-" json:"info"`
		Users []User          `bson:"-" json:"users"`
	}

	JwtClaims struct {
		ID    string `json:"id"`
		Email string `json:"email"`
		Role  int    `json:"role"`
		jwt.RegisteredClaims
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
	err := conn.Collection(collections.Users).FindOne(context.TODO(), ObjectIdHex(id)).Decode(user)
	if err != nil {
		return nil
	}

	return user
}

func GetUserByEmail(email string) *User {
	conn := connection.Mongo()

	user := &User{}
	err := conn.Collection(collections.Users).FindOne(context.TODO(), bson.M{
		Email: email,
	}).Decode(user)
	if err != nil {
		return nil
	}

	return user
}

func GetUsers(perPage int, page int) *Users {
	conn := connection.Mongo()

	skip := (page - 1) * perPage
	sortOptions := options.Find().SetSort(bson.M{"name": -1})

	total, err := conn.Collection(collections.Users).CountDocuments(context.TODO(), bson.M{})
	if err != nil {
		return nil
	}
	cursor, err := conn.Collection(collections.Users).Find(context.TODO(), bson.M{}, sortOptions, options.Find().SetSkip(int64(skip)).SetLimit(int64(perPage)))
	if cursor == nil {
		return nil
	}
	defer cursor.Close(context.TODO())
	userArray := make([]User, 0)
	for cursor.Next(context.TODO()) {
		user := new(User)
		if err = cursor.Decode(user); err != nil {
			continue
		}
		userArray = append(userArray, *user)
	}
	if len(userArray) == 0 {
		userArray = []User{}
	}

	info := &PaginationInfo{
		Current:       page,
		TotalPages:    int(math.Ceil(float64(total) / float64(perPage))),
		PerPage:       perPage,
		TotalRecords:  int(total),
		RecordsOnPage: len(userArray),
	}

	users := &Users{
		Info:  info,
		Users: userArray,
	}

	return users
}

func UpsertUser(user *User) error {
	if !util.IsBcrypt(user.Password) {
		user.Password = *util.Bcrypt(user.Password)
	}
	if user.ID == nil {
		newID := primitive.NewObjectID()
		user.ID = &newID
		user.Created = time.Now()
	}
	user.Modified = time.Now()

	_, err := connection.Mongo().Collection(collections.Users).UpdateOne(context.TODO(), bson.M{"_id": user.ID}, bson.M{"$set": user}, &options.UpdateOptions{Upsert: connection.TruePtr})
	return err
}

func DeleteUser(user *User) error {
	_, err := connection.Mongo().Collection(collections.Users).DeleteOne(context.TODO(), bson.M{"_id": user.ID})
	return err
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
		ID:    user.ID.Hex(),
		Email: user.Email,
		Role:  user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: &jwt.NumericDate{
				Time: time.Now().Add(time.Hour * 24),
			},
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ts, err := token.SignedString([]byte(configs.GetEnv().Sign.Secret))
	if err != nil {
		panic("couldnt create token")
	}

	return user, &ts
}

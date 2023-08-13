package connection

import (
	"context"

	"github.com/mohemohe/parakeet/server/configs"
	"github.com/mohemohe/parakeet/server/util"
	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var mongoConn *mongo.Database
var TruePtr = &[]bool{true}[0]

func Mongo() *mongo.Database {
	if mongoConn == nil {
		mongoConn = newMongo()
	}
	return mongoConn
}

func newMongo() *mongo.Database {
	util.Logger().WithFields(logrus.Fields{
		"address":  configs.GetEnv().Mongo.Address,
		"database": configs.GetEnv().Mongo.Database,
	}).Info("create mongo connection")

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(configs.GetEnv().Mongo.Address))
	if err != nil {
		panic(err)
	}
	if err := client.Ping(context.TODO(), readpref.Primary()); err != nil {
		panic(err)
	}
	util.Logger().Info("mongo connection created")

	return client.Database(configs.GetEnv().Mongo.Database)
}

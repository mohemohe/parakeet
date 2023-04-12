package models

import (
	"time"

	"github.com/globalsign/mgo/bson"
	"github.com/mohemohe/parakeet/server/models/connection"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/net/context"
)

type (
	KV struct {
		ID       primitive.ObjectID `bson:"_id" json:"_id"`
		Created  time.Time          `bson:"_created" json:"_created"`
		Modified time.Time          `bson:"_modified" json:"_modified"`

		Key   string      `bson:"key" json:"key"`
		Value interface{} `bson:"value" json:"value"`
	}
)

func GetKVS(key string) *KV {
	result := new(KV)
	err := connection.Mongo().Collection(collections.KVS).FindOne(context.TODO(), bson.M{"key": key}).Decode(result)
	if err != nil {
		return nil
	}

	return result
}

func SetKVS(key string, value interface{}) error {
	_, err := connection.Mongo().Collection(collections.KVS).UpdateOne(context.TODO(), bson.M{"key": key}, bson.M{"$set": bson.M{"key": key, "value": value}}, &options.UpdateOptions{Upsert: connection.TruePtr})
	return err
}

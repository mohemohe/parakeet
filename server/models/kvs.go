package models

import (
	"github.com/globalsign/mgo/bson"
	"github.com/go-bongo/bongo"
	"github.com/mohemohe/parakeet/server/models/connection"
)

type (
	KV struct {
		bongo.DocumentBase `bson:",inline"`
		Key                string      `bson:"key" json:"key"`
		Value              interface{} `bson:"value" json:"value"`
	}
)

func GetKVS(key string) *KV {
	kv := &KV{}
	err := connection.Mongo().Collection(collections.KVS).FindOne(bson.M{"key": key}, kv)
	if err != nil {
		return nil
	}
	return kv
}

func SetKVS(key string, value interface{}) error {
	_, err := connection.Mongo().Collection(collections.KVS).Collection().Upsert(bson.M{"key": key}, bson.M{"key": key, "value": value})
	return err
}

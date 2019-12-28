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
	cacheKey := "kvs:" + key

	result := new(KV)
	if err := GetCache(cacheKey, result); err == nil {
		return result
	}

	err := connection.Mongo().Collection(collections.KVS).FindOne(bson.M{"key": key}, result)
	if err != nil {
		return nil
	}

	_ = SetCache(cacheKey, result)

	return result
}

func SetKVS(key string, value interface{}) error {
	_, err := connection.Mongo().Collection(collections.KVS).Collection().Upsert(bson.M{"key": key}, bson.M{"key": key, "value": value})
	if err == nil {
		PurgeInternalCache()
		_ = SetCache("kvs:"+key, value)
	}
	return err
}

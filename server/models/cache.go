package models

import (
	"errors"
	"github.com/mitchellh/mapstructure"
	"github.com/mohemohe/parakeet/server/models/connection"
	"github.com/mohemohe/parakeet/server/util"
	"github.com/sirupsen/logrus"
	"time"
)

const (
	purgeCacheEvent = "purge_cache"
)

func GetCache(key string, ptr interface{}) error {
	if item, hit := connection.DsCache().Get(key); hit {
		return util.BytesStringToStruct(item, ptr)
	}
	return errors.New("not found")
}

func SetCache(key string, value interface{}) error {
	v, err := util.StructToBytesString(value)
	if err != nil {
		return err
	}
	return connection.DsCache().Set(key, v, 365*24*time.Hour)
}

func PurgeCache() {
	go func() {
		connection.PurgeDsCache()

		if err := pubsub.Publish(purgeCacheEvent, ""); err != nil {
			util.Logger().Warn(err)
		}

		if kv := GetKVS(KVCloudflare); kv != nil {
			v := new(Cloudflare)
			if err := mapstructure.Decode(kv.Value, v); err == nil {
				if v.Enable && v.ZoneID != "" && v.APIToken != "" {
					go util.PurgeCloudflare(v.ZoneID, v.APIToken)
				}
			}
		}
	}()
}

func subscribePurgeCacheEvent() {
	ch := pubsub.Subscribe(purgeCacheEvent)
	defer pubsub.UnSubscribe(purgeCacheEvent, ch)

	for {
		_, ok := <-*ch
		if !ok {
			break
		}
		util.Logger().WithFields(logrus.Fields{
			"event": purgeCacheEvent,
		}).Info("published")
		connection.PurgeDsCache()
	}
}

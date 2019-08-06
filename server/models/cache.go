package models

import (
	"errors"
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
	return connection.DsCache().Set(key, v, 365 * 24 * time.Hour)
}

func PurgeCache() {
	go Publish(purgeCacheEvent, "")
}

func subscribePurgeCacheEvent() {
	ch := Subscribe(purgeCacheEvent)
	defer UnSubscribe(purgeCacheEvent, ch)

	for {
		<- *ch
		util.Logger().WithFields(logrus.Fields{
			"event": purgeCacheEvent,
		}).Info("published")
		connection.PurgeDsCache()
	}
}
package models

import (
	"github.com/mitchellh/mapstructure"
	"github.com/mohemohe/parakeet/server/util"
)

const (
	purgeCacheEvent = "purge_cache"
)

func PurgeCache() {
	go func() {
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

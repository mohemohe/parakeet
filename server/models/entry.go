package models

import (
	"github.com/globalsign/mgo/bson"
	"github.com/go-bongo/bongo"
	"github.com/mohemohe/parakeet/server/models/connection"
	"strconv"
)

type (
	Entry struct {
		bongo.DocumentBase `bson:",inline"`
		Title              string        `bson:"title" json:"title"`
		Tag                []string      `bson:"tag" json:"tag"`
		Body               string        `bson:"body" json:"body"`
		Author             bson.ObjectId `bson:"author" json:"author"`
		Draft              bool          `bson:"draft" json:"draft"`
	}

	Entries struct {
		Info    *bongo.PaginationInfo `bson:"-" json:"info"`
		Entries []Entry               `bson:"-" json:"entries"`
	}
)

func GetEntryById(id string) *Entry {
	cacheKey := "entry:" + id

	entry := new(Entry)
	if err := GetCache(cacheKey, entry); err == nil {
		return entry
	}

	conn := connection.Mongo()
	err := conn.Collection(collections.Entries).FindById(bson.ObjectIdHex(id), entry)
	if err != nil {
		return nil
	}

	if kv := GetKVS(KVEnableMongoDBQueryCache); kv != nil {
		if kv.Value.(bool) == true {
			_ = SetCache(cacheKey, entry)
		}
	}

	return entry
}

func GetEntries(perPage int, page int, includeDraft bool) *Entries {
	cacheKey := "entries:" + strconv.Itoa(perPage) + ":" + strconv.Itoa(page)

	entries := new(Entries)
	if err := GetCache(cacheKey, entries); err == nil {
		return entries
	}

	query := bson.M{}
	if !includeDraft {
		query["draft"] = bson.M{
			"$ne": true,
		}
	}

	conn := connection.Mongo()
	find := conn.Collection(collections.Entries).Find(query)
	if find == nil {
		return nil
	}
	find.Query.Sort("-_created")
	info, err := find.Paginate(perPage, page)
	if err != nil {
		return nil
	}
	entryArray := make([]Entry, info.RecordsOnPage)
	for i := 0; i < info.RecordsOnPage; i++ {
		_ = find.Next(&entryArray[i])
	}

	entries = &Entries{
		Info:    info,
		Entries: entryArray,
	}

	if kv := GetKVS(KVEnableMongoDBQueryCache); kv != nil {
		if kv.Value.(bool) == true {
			_ = SetCache(cacheKey, entries)
		}
	}

	return entries
}

func UpsertEntry(entry *Entry) error {
	PurgeCache()
	return connection.Mongo().Collection(collections.Entries).Save(entry)
}

func DeleteEntry(entry *Entry) error {
	PurgeCache()
	return connection.Mongo().Collection(collections.Entries).DeleteDocument(entry)
}
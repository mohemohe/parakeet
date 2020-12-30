package models

import (
	"github.com/globalsign/mgo/bson"
	"github.com/go-bongo/bongo"
	"github.com/mohemohe/parakeet/server/models/connection"
	"regexp"
	"strconv"
	"strings"
)

type (
	Entry struct {
		bongo.DocumentBase `bson:",inline"`
		Title              string        `bson:"title" json:"title"`
		Tag                []string      `bson:"tag" json:"tag"`
		Body               string        `bson:"body" json:"body"`
		Author             bson.ObjectId `bson:"author" json:"author"`
		Draft              bool          `bson:"draft" json:"draft"`
		FindCount          *int          `bson:"find_count" json:"find_count,omitempty"`
	}

	Entries struct {
		Info    *bongo.PaginationInfo `bson:"-" json:"info"`
		Entries []Entry               `bson:"-" json:"entries"`
	}
)

func GetEntryById(id string, includeDraft bool, shouldCount bool) *Entry {
	cacheKey := "entry:" + id

	entry := new(Entry)
	if err := GetCache(cacheKey, entry); err == nil {
		if entry.Draft {
			if includeDraft {
				return entry
			}
			return nil
		}
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

	if entry.Draft {
		if includeDraft {
			return entry
		}
		return nil
	}
	if shouldCount {
		go func() {
			conn.Collection(collections.Entries).Collection().UpdateId(bson.ObjectIdHex(id), bson.M{
				"$inc": bson.M{
					"find_count": 1,
				},
			})
		}()
	}
	return entry
}

func GetEntries(perPage int, page int, search string, includeDraft bool) *Entries {
	cacheKey := "entries:" + strconv.Itoa(perPage) + ":" + strconv.Itoa(page) + ":" + search

	entries := new(Entries)
	if err := GetCache(cacheKey, entries); err == nil {
		if len(entries.Entries) == 0 {
			entries.Entries = []Entry{}
		}
		return entries
	}

	query := bson.M{}
	if !includeDraft {
		query["draft"] = bson.M{
			"$ne": true,
		}
	}

	allowSearch := false
	kv := GetKVS(KVMongoDBSearch)
	if kv != nil {
		allowSearch = kv.Value.(string) == "regex"
	}
	if allowSearch && search != "" {
		word := strings.Split(search, " ")
		titleCriteria := make([]bson.M, 0)
		bodyCriteria := make([]bson.M, 0)
		for _, v := range word {
			regex := bson.RegEx{`.*` + regexp.QuoteMeta(v) + `.*`, ""}
			titleCriteria = append(titleCriteria, bson.M{"title": regex})
			bodyCriteria = append(bodyCriteria, bson.M{"body": regex})
		}

		query["$or"] = []bson.M{
			{"$and": titleCriteria},
			{"$and": bodyCriteria},
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
	if len(entryArray) == 0 {
		entryArray = []Entry{}
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

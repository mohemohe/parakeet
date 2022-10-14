package models

import (
	"regexp"
	"strings"

	"github.com/globalsign/mgo/bson"
	"github.com/go-bongo/bongo"
	"github.com/mohemohe/parakeet/server/models/connection"
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
	conn := connection.Mongo()
	entry := new(Entry)

	defer func() {
		if shouldCount {
			go func() {
				err := conn.Collection(collections.Entries).Collection().UpdateId(bson.ObjectIdHex(id), bson.M{
					"$inc": bson.M{
						"find_count": 1,
					},
				})
				if err != nil && entry.FindCount == nil {
					conn.Collection(collections.Entries).Collection().UpdateId(bson.ObjectIdHex(id), bson.M{
						"$set": bson.M{
							"find_count": 1,
						},
					})
				}
			}()
		}
	}()

	err := conn.Collection(collections.Entries).FindById(bson.ObjectIdHex(id), entry)
	if err != nil {
		return nil
	}

	if entry.Draft {
		if includeDraft {
			return entry
		}
		return nil
	}

	return entry
}

func GetEntries(perPage int, page int, search string, includeDraft bool) *Entries {
	query := bson.M{}
	entries := new(Entries)

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

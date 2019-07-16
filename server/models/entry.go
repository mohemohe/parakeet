package models

import (
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
	}

	Entries struct {
		Info    *bongo.PaginationInfo `bson:"-" json:"info"`
		Entries []Entry               `bson:"-" json:"entries"`
	}
)


func GetEntryById(id string) *Entry {
	conn := connection.Mongo()

	entry := &Entry{}
	err := conn.Collection(collections.Entries).FindById(bson.ObjectIdHex(id), entry)
	if err != nil {
		return nil
	}

	return entry
}

func GetEntries(perPage int, page int) *Entries {
	conn := connection.Mongo()

	result := conn.Collection(collections.Entries).Find(bson.M{})
	if result == nil {
		return nil
	}
	info, err := result.Paginate(perPage, page)
	if err != nil {
		return nil
	}
	entries := make([]Entry, info.RecordsOnPage)
	for i := 0; i < info.RecordsOnPage; i++ {
		_ = result.Next(&entries[i])
	}

	return &Entries{
		Info:  info,
		Entries: entries,
	}
}

func UpsertEntry(entry *Entry) error {
	return connection.Mongo().Collection(collections.Entries).Save(entry)
}

func DeleteEntry(entry *Entry) error {
	return connection.Mongo().Collection(collections.Entries).DeleteDocument(entry)
}

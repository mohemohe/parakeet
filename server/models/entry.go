package models

import (
	"context"
	"math"
	"regexp"
	"strings"
	"time"

	"github.com/mohemohe/parakeet/server/models/connection"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type (
	Entry struct {
		ID       primitive.ObjectID `bson:"_id" json:"_id"`
		Created  time.Time          `bson:"_created" json:"_created"`
		Modified time.Time          `bson:"_modified" json:"_modified"`

		Title     string             `bson:"title" json:"title"`
		Tag       []string           `bson:"tag" json:"tag"`
		Body      string             `bson:"body" json:"body"`
		Author    primitive.ObjectID `bson:"author" json:"author"`
		Draft     bool               `bson:"draft" json:"draft"`
		FindCount *int               `bson:"find_count" json:"find_count,omitempty"`
	}

	Entries struct {
		Info    *PaginationInfo `bson:"-" json:"info"`
		Entries []Entry         `bson:"-" json:"entries"`
	}
)

func GetEntryById(id string, includeDraft bool, shouldCount bool) *Entry {
	conn := connection.Mongo()
	entry := new(Entry)

	defer func() {
		if shouldCount {
			go func() {
				_, err := conn.Collection(collections.Entries).UpdateByID(context.TODO(), ObjectIdHex(id), bson.M{
					"$inc": bson.M{
						"find_count": 1,
					},
				})
				if err != nil && entry.FindCount == nil {
					conn.Collection(collections.Entries).UpdateByID(context.TODO(), ObjectIdHex(id), bson.M{
						"$set": bson.M{
							"find_count": 1,
						},
					})
				}
			}()
		}
	}()

	err := conn.Collection(collections.Entries).FindOne(context.TODO(), ObjectIdHex(id)).Decode(entry)
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
			// regex := primitive.Regex{`.*` + regexp.QuoteMeta(v) + `.*`, ""}
			regex := primitive.Regex{Pattern: `.*` + regexp.QuoteMeta(v) + `.*`, Options: ""}
			titleCriteria = append(titleCriteria, bson.M{"title": bson.M{"$regex": regex}})
			bodyCriteria = append(bodyCriteria, bson.M{"body": bson.M{"$regex": regex}})
		}

		query["$or"] = []bson.M{
			{"$and": titleCriteria},
			{"$and": bodyCriteria},
		}
	}

	sortOptions := options.Find().SetSort(bson.M{"_created": -1})
	skip := (page - 1) * perPage

	conn := connection.Mongo()
	total, err := conn.Collection(collections.Entries).CountDocuments(context.TODO(), query)
	if err != nil {
		return nil
	}
	cursor, err := conn.Collection(collections.Entries).Find(context.TODO(), query, sortOptions, options.Find().SetSkip(int64(skip)).SetLimit(int64(perPage)))
	if cursor == nil {
		return nil
	}
	defer cursor.Close(context.TODO())
	entryArray := make([]Entry, 0)
	for cursor.Next(context.TODO()) {
		entry := new(Entry)
		if err = cursor.Decode(entry); err != nil {
			continue
		}
		entryArray = append(entryArray, *entry)
	}
	if len(entryArray) == 0 {
		entryArray = []Entry{}
	}

	info := &PaginationInfo{
		Current:       page,
		TotalPages:    int(math.Ceil(float64(total) / float64(perPage))),
		PerPage:       perPage,
		TotalRecords:  int(total),
		RecordsOnPage: len(entryArray),
	}

	entries = &Entries{
		Info:    info,
		Entries: entryArray,
	}

	return entries
}

func UpsertEntry(entry *Entry) error {
	PurgeCache()
	filter := bson.M{"_id": entry.ID}

	now := time.Now()

	if entry.ID.IsZero() {
		entry.ID = primitive.NewObjectID()
		entry.Created = now
	}
	entry.Modified = now
	_, err := connection.Mongo().Collection(collections.Entries).UpdateOne(context.TODO(), filter, bson.M{"$set": entry}, &options.UpdateOptions{Upsert: connection.TruePtr})
	return err
}

func DeleteEntry(entry *Entry) error {
	PurgeCache()
	// filter := bson.M{"_id": bson.M{"$eq": entry.ID}}
	filter := bson.M{"_id": entry.ID}
	_, err := connection.Mongo().Collection(collections.Entries).DeleteOne(context.TODO(), filter)
	return err
}

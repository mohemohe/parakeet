package models

import (
	"crypto/tls"
	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"github.com/mohemohe/parakeet/server/configs"
	"github.com/mohemohe/parakeet/server/util"
	"github.com/sirupsen/logrus"
	"net"
	"time"
)

type Message struct {
	Event     string    `json:"event" bson:"event"`
	Body      string    `json:"body" bson:"body"`
	Timestamp time.Time `json:"timestamp" bson:"timestamp"`
}

func InitPubSub() error {
	defer func() {
		if err := recover(); err != nil {
			util.Logger().Warn(err)
		}
	}()
	session := mustSession()
	defer session.SetMode(mgo.SecondaryPreferred, true)
	return session.DB(configs.GetEnv().Mongo.Database).C(collections.PubSub).Create(&mgo.CollectionInfo{
		Capped:   true,
		MaxBytes: 1024 * 1024 * 16,
		MaxDocs:  1024,
	})
}

var events = map[string][]*chan string{}

func session() (*mgo.Session, error) {
	// bongoのプールを使うとCloneしても何故か2秒くらいかかるからmgoで直接dialする
	dialInfo, err := mgo.ParseURL(configs.GetEnv().Mongo.Address)
	if err != nil {
		return nil, err
	}
	if configs.GetEnv().Mongo.SSL {
		tlsConfig := &tls.Config{}
		dialInfo.DialServer = func(addr *mgo.ServerAddr) (net.Conn, error) {
			conn, err := tls.Dial("tcp", addr.String(), tlsConfig)
			return conn, err
		}
	}
	return mgo.DialWithInfo(dialInfo)
}

func mustSession() *mgo.Session {
	session, err := session()
	if err != nil {
		panic(err)
	}
	session.SetMode(mgo.Strong, true)
	return session
}

func StartPubSub() {
	tail := mustSession().DB(configs.GetEnv().Mongo.Database).C(collections.PubSub).Find(bson.M{}).Tail(10 * time.Second)
	defer func() {
		tail.Close()
	}()

	util.Logger().Info("mongo pubsub started")

	sleep := 100 * time.Millisecond

	t := time.Now()
	var message Message
	for {
		time.Sleep(sleep)

		for tail.Next(&message) {
			if message.Timestamp.After(t) {
				util.Logger().WithFields(logrus.Fields{
					"event": message.Event,
				}).Info("message received")
				for _, ch := range events[message.Event] {
					*ch <- message.Body
				}
			}
		}

		if tail.Err() != nil {
			util.Logger().WithField("error", tail.Err()).Warn("tail error")
			tail.Close()
			break
		}

		if tail.Timeout() {
			continue
		}
	}
}

func Publish(event string, body string) error {
	session := mustSession()
	session.SetMode(mgo.Strong, true)
	defer session.SetMode(mgo.SecondaryPreferred, true)
	return session.DB(configs.GetEnv().Mongo.Database).C(collections.PubSub).Insert(&Message{
		Event:     event,
		Body:      body,
		Timestamp: time.Now(),
	})
}

func Subscribe(event string) *chan string {
	ch := make(chan string)
	events[event] = append(events[event], &ch)
	return &ch
}

func UnSubscribe(event string, ch *chan string) {
	index := -1
	for i, c := range events[event] {
		if ch == c {
			index = i
			break
		}
	}

	if index == -1 {
		util.Logger().WithFields(logrus.Fields{
			"event": event,
			"chan":  ch,
		}).Error("pubsub unsubscribe error. maybe leak resources")
	}

	events[event] = append(events[event][:index], events[event][index+1:]...)
	close(*ch)
}

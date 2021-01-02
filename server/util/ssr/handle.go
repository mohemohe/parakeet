package ssr

import (
	"encoding/json"
	"fmt"
	"github.com/globalsign/mgo/bson"
	"github.com/labstack/echo/v4"
	"github.com/mohemohe/parakeet/server/configs"
	"github.com/mohemohe/parakeet/server/models"
	"github.com/mohemohe/parakeet/server/util"
	"github.com/pkg/errors"
	"html/template"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"
)

func Handle(c echo.Context, pool *Pool) error {
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("%+v\n", errors.WithStack(r.(error)))
			_ = c.Render(http.StatusInternalServerError, "ssr.html", map[string]interface{}{
				"Error": r,
				"Unix":  configs.GetUnix(),
			})
		}
	}()

	js := pool.get()
	defer pool.release(js)

	if !js.Callable {
		if js.err != nil {
			return c.Render(http.StatusInternalServerError, "ssr.html", Result{
				Error: js.err.Error(),
				Title: "parakeet",
				Meta:  "",
				Unix:  configs.GetUnix(),
			})
		}
		return c.Render(http.StatusInternalServerError, "ssr.html", Result{
			Error: "invalid js",
			Title: "parakeet",
			Meta:  "",
			Unix:  configs.GetUnix(),
		})
	}

	title := "parakeet"
	titleKV := models.GetKVS(models.KVSiteTitle)
	if titleKV != nil && titleKV.Value != "" {
		title = titleKV.Value.(string)
	}
	initialState, entry, shouldHandle, timeout := initializeState(c)

	if !shouldHandle {
		return c.Render(http.StatusOK, "ssr.html", Result{
			Title: title,
			Unix:  configs.GetUnix(),
		})
	}

	ch := js.Exec(map[string]interface{}{
		"url":     c.Request().URL.Path,
		"title":   title,
		"headers": map[string][]string(c.Request().Header),
		"state":   initialState,
	})

	select {
	case res := <-ch:
		res.Title = title
		res.Unix = configs.GetUnix()
		if js.err != nil {
			util.Logger().WithField("error", res.Error).Errorln("js eval error")
			return c.Render(http.StatusInternalServerError, "ssr.html", Result{
				Error: js.err.Error(),
				Title: res.Title,
				Unix:  configs.GetUnix(),
			})
		}
		if len(res.Error) == 0 {
			if entry != nil && entry.Title != "" {
				res.Title = entry.Title + " - " + res.Title
				meta := `<meta property="og:title" content="` + entry.Title + `" />` + "\n" +
					`<meta property="og:url" content="` + util.JoinURL(util.BaseURL(c), c.Request().URL.Path) + `" />` + "\n" +
					`<meta property="og:type" content="article" />` + "\n" +
					`<meta property="og:description" content="` + strings.Split(entry.Body, "  ")[0] + `" />` + "\n" +
					`<meta property="og:site" content="` + title + `" />` + "\n"
				util.Logger().Debugln("meta generated:", meta)
				res.Meta = template.HTML(meta)
			}
			return c.Render(http.StatusOK, "ssr.html", res)
		} else {
			util.Logger().WithField("error", res.Error).Errorln("js result error")
			return c.Render(http.StatusInternalServerError, "ssr.html", res)
		}
	case <-time.After(time.Duration(timeout) * time.Millisecond):
		util.Logger().Warn("cant keep up!", "fallback to CSR")
		return c.Render(http.StatusOK, "ssr.html", Result{
			Title: title,
			Unix:  configs.GetUnix(),
		})
	}
}

func initializeState(c echo.Context) (map[string]interface{}, *models.Entry, bool, int) {
	path := c.Request().URL.Path

	entries := &models.Entries{}
	entry := &models.Entry{
		Tag: make([]string, 0),
	}

	enableEntriesSSR := true
	enableEntrySSR := true
	timeout := 3000
	shouldHandle := false
	kv := models.GetKVS(models.KVServerSideRendering)
	if kv != nil {
		value := kv.Value.(bson.M)
		enableEntriesSSR = value["entries"].(bool)
		enableEntrySSR = value["entry"].(bool)
		if value["timeout"] != nil {
			timeout = int(value["timeout"].(float64))
		}
	}

	if enableEntriesSSR && path == "/" {
		entries = models.GetEntries(5, 1, "", false)
		shouldHandle = true
	}
	if enableEntriesSSR && strings.HasPrefix(path, "/entries/") {
		r := regexp.MustCompile(`^/entries/(\d+)`).FindAllStringSubmatch(path, -1)
		if len(r) == 1 && len(r[0]) == 2 {
			if page, err := strconv.Atoi(r[0][1]); err == nil {
				entries = models.GetEntries(5, page, "", false)
				shouldHandle = true
			}
		}
	}
	if enableEntrySSR && strings.HasPrefix(path, "/entry/") {
		r := regexp.MustCompile(`^/entry/(.*)`).FindAllStringSubmatch(path, -1)
		if len(r) == 1 && len(r[0]) == 2 {
			entry = models.GetEntryById(r[0][1], false, true)
			shouldHandle = true
		}
	}

	return map[string]interface{}{
		"entryStore": map[string]interface{}{
			"entries":  toJson(entries.Entries),
			"paginate": toJson(entries.Info),
			"entry":    toJson(entry),
		},
	}, entry, shouldHandle, timeout
}

func toJson(t interface{}) (result string) {
	defer func() {
		if err := recover(); err != nil {
			util.Logger().WithField("target", t).Warn("toJson failed")
			result = "{}"
		}
	}()
	b, err := json.Marshal(t)
	if err != nil {
		panic(err)
	}
	result = string(b)
	return
}

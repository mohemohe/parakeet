package controllers

import (
	"github.com/labstack/echo/v4"
	"github.com/mohemohe/parakeet/server/models"
	"net/http"
	"strconv"
)

type (
	EntryResponse struct {
		Entry *models.Entry `json:"entry"`
	}

	EntriesResponse struct {
		Entries *[]models.Entries `json:"entries"`
	}
)

func GetEntries(c echo.Context) error {
	limit, err := strconv.Atoi(c.QueryParam("limit"))
	if err != nil {
		limit = 10
	}
	page, err := strconv.Atoi(c.QueryParam("page"))
	if err != nil {
		page = 1
	}

	users := models.GetEntries(limit, page)
	if users == nil {
		panic("db error")
	}

	return c.JSON(http.StatusOK, users)
}

func GetEntry(c echo.Context) error {
	id := c.Param("id")
	entry := models.GetEntryById(id)
	if entry == nil {
		panic("the user not found")
	}

	return c.JSON(http.StatusOK, EntryResponse{
		Entry: entry,
	})
}

func UpsertEntry(c echo.Context) error {
	entry := new(models.Entry)
	if err := c.Bind(entry); err != nil {
		panic("bind error")
	}
	user := c.Get("User").(*models.User)
	entry.Author = user.Id

	id := c.Param("id")
	if id != "" && id != "undefined" {
		current := models.GetEntryById(id)
		if current != nil {
			current.Title = entry.Title
			current.Tag = entry.Tag
			current.Body = entry.Body
			current.Author = entry.Author
			entry = current
		}
	} else {
		entry = &models.Entry{
			Title: entry.Title,
			Tag: entry.Tag,
			Body: entry.Body,
			Author: entry.Author,
		}
	}

	if err := models.UpsertEntry(entry); err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, EntryResponse{
		Entry: entry,
	})
}

func DeleteEntry(c echo.Context) error {
	id := c.Param("id")
	entry := models.GetEntryById(id)
	if entry == nil {
		panic("the user not found")
	}

	if err := models.DeleteEntry(entry); err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, struct{}{})
}

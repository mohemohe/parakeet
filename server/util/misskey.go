package util

import (
	"bytes"
	"encoding/json"
	"github.com/mohemohe/fetch"
	"github.com/pkg/errors"
	"net/url"
	"path"
)

type (
	noteCreateBody struct {
		Token string `json:"i"`
		Text  string `json:"text"`
	}
)

func PostMisskey(status string, baseURL string, token string) error {
	u, err := url.Parse(baseURL)
	if err != nil {
		return err
	}
	u.Path = path.Join(u.Path, "/api/notes/create")

	body := noteCreateBody{
		Token: token,
		Text: status,
	}
	b, err := json.Marshal(body)
	if err != nil {
		return err
	}

	res, err := fetch.Fetch(u.String(), fetch.Option{
		Method:  "POST",
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
		Body: bytes.NewReader(b),
	})
	if err != nil {
		return err
	}

	if !res.OK {
		return errors.New("misskey post error:" + res.StatusText)
	}

	return nil
}

package util

import (
	"net/http"
	"net/url"
	"path"
	"strings"
)

func PostMastodon(status string, baseURL string, token string) error {
	u, err := url.Parse(baseURL)
	if err != nil {
		return err
	}
	u.Path = path.Join(u.Path, "/api/v1/statuses")

	values := url.Values{}
	values.Set("status", status)

	req, err := http.NewRequest("POST", u.String(), strings.NewReader(values.Encode()))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	return err
}

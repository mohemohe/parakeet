package util

import (
	"bytes"
	"io/ioutil"
	"net/http"
	"net/url"
	"path"
)

func PurgeCloudflare(zoneID string, APItoken string) error {
	baseURL := "https://api.cloudflare.com/client/v4/zones/"
	u, err := url.Parse(baseURL)
	if err != nil {
		Logger().WithField("error", err).Error("cloudflare purge cache error")
		return err
	}
	u.Path = path.Join(u.Path, zoneID, "/purge_cache")

	payload := []byte(`{"purge_everything":true}`)

	req, err := http.NewRequest("POST", u.String(), bytes.NewBuffer(payload))
	if err != nil {
		Logger().WithField("error", err).Error("cloudflare purge cache error")
		return err
	}
	req.Header.Set("Authorization", "Bearer "+APItoken)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		Logger().WithField("error", err).Error("cloudflare purge cache error")
		return err
	}
	defer resp.Body.Close()

	if body, err := ioutil.ReadAll(resp.Body); err == nil {
		Logger().WithField("body", string(body)).Info("cloudflare purge cache")
	} else {
		Logger().WithField("error", err).Error("cloudflare purge cache error")
	}

	return err
}

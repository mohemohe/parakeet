package ssr

import (
	"html/template"
)

type Result struct {
	Error string `json:"error"`
	App   string `json:"app"`
	Style string `json:"style"`
	Title string `json:"title"`
	Meta  string `json:"meta"`
	State string `json:"state"`
	Unix  int64  `json:"-"`
}

func (r Result) RawApp() template.HTML {
	return template.HTML(r.App)
}

func (r Result) RawStyle() template.HTML {
	return template.HTML(`<style id="typestyle">` + r.Style + "</style>")
}

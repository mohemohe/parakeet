package templates

import (
	"github.com/labstack/echo/v4"
	"github.com/playree/goingtpl"
	"html/template"
	"io"
)

type Template struct {
	templates *template.Template
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	tpl := template.Must(goingtpl.ParseFile(name))
	return tpl.ExecuteTemplate(w, name, data)
}

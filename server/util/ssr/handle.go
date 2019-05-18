package ssr

import (
	"github.com/labstack/echo/v4"
	"github.com/mohemohe/parakeet/server/util"
	uuid "github.com/nu7hatch/gouuid"
	"net/http"
	"time"
)

func Handle(c echo.Context, pool *Pool) error {
	defer func() {
		if r := recover(); r != nil {
			_ = c.Render(http.StatusInternalServerError, "ssr.html", Result{
				Error: r.(string),
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
			})
		}
		return c.Render(http.StatusInternalServerError, "ssr.html", Result{
			Error: "invalid js",
			Title: "parakeet",
			Meta:  "",
		})
	}

	ch := js.Exec(map[string]interface{}{
		"url":     c.Request().URL.String(),
		"headers": map[string][]string(c.Request().Header),
		"uuid":    c.Get("uuid").(*uuid.UUID).String(),
	})

	select {
	case res := <-ch:
		if js.err != nil {
			util.Logger().WithField("error", res.Error).Errorln("js eval error")
			return c.Render(http.StatusInternalServerError, "ssr.html", Result{
				Error: js.err.Error(),
				Title: "parakeet",
				Meta:  "",
			})
		}
		if len(res.Error) == 0 {
			return c.Render(http.StatusOK, "ssr.html", res)
		} else {
			util.Logger().WithField("error", res.Error).Errorln("js result error")
			return c.Render(http.StatusInternalServerError, "ssr.html", res)
		}
	case <-time.After(3 * time.Second):
		util.Logger().Errorln("cant keep up!")
		return c.Render(http.StatusInternalServerError, "ssr.html", Result{
			Error: "timeout",
			Title: "parakeet",
			Meta:  "",
		})
	}
}

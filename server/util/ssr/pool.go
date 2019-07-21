package ssr

import (
	"github.com/mohemohe/parakeet/server/configs"
	"github.com/mohemohe/parakeet/server/util"
	"net/http"
	"runtime"
	"time"
)

type (
	Pool struct {
		JS chan *JS
	}
)

func NewPool(handler http.Handler) *Pool {
	cpus := runtime.NumCPU()
	if configs.GetEnv().Echo.Env == "debug" {
		util.Logger().Warnln("ECHO_ENV is 'debug'. worker pool limit to 1.")
		cpus = 1
	}

	this := &Pool{
		JS: make(chan *JS, cpus),
	}

	go func() {
		for i := 0; i < cpus; i++ {
		INIT:
			js, ready := newJS(handler)
			if !ready {
				util.Logger().Warnln("JS instance create error: ", i+1, "/", cpus)
				time.Sleep(time.Microsecond)
				goto INIT
			}
			util.Logger().Infoln("JS instance created: ", i+1, "/", cpus)
			this.JS <- js
		}
	}()

	return this
}

func (this *Pool) get() *JS {
	util.Logger().Debugln("JS instance from Pool")
	return <-this.JS
}

func (this *Pool) release(js *JS) {
	util.Logger().Debugln("JS instance to Pool")
	this.JS <- js
}

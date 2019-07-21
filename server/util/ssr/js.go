package ssr

import (
	crand "crypto/rand"
	"encoding/binary"
	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/eventloop"
	"github.com/mitchellh/mapstructure"
	"github.com/mohemohe/parakeet/server/util"
	"github.com/olebedev/gojax/fetch"
	"io/ioutil"
	mrand "math/rand"
	"net/http"
	"path/filepath"
)

type (
	JS struct {
		*eventloop.EventLoop
		result   chan Result
		ready    chan bool
		fn       goja.Callable
		Callable bool
		err      error
	}
)

func newJS(handler http.Handler) (*JS, bool) {
	util.Logger().Debugln("new JS")
	this := &JS{
		EventLoop: eventloop.NewEventLoop(),
		result:    make(chan Result, 1),
		ready:     make(chan bool),
	}

	this.EventLoop.Start()
	_ = fetch.Enable(this.EventLoop, handler)

	jsPath, _ := filepath.Abs("./public/js/guest/ssr.js")
	bundle, err := ioutil.ReadFile(jsPath)
	if err != nil {
		this.err = err
		util.Logger().WithField("error", err).Errorln("js read error")
	}

	util.Logger().Debugln("eventloop started")
	this.EventLoop.RunOnLoop(func(runtime *goja.Runtime) {
		util.Logger().Debugln("inner eventloop")

		var seed int64
		if err := binary.Read(crand.Reader, binary.LittleEndian, &seed); err != nil {
			this.err = err
			this.ready <- false
			util.Logger().WithField("error", err).Errorln("random seed read error")
			return
		}
		runtime.SetRandSource(goja.RandSource(mrand.New(mrand.NewSource(seed)).Float64))
		util.Logger().Debugln("set random seed")

		util.Logger().Debugln("start initiate js")
		_, err := runtime.RunString(string(bundle))
		if err != nil {
			this.err = err
			this.ready <- false
			util.Logger().WithField("error", err).Errorln("js load error")
			return
		}
		util.Logger().Debugln("initial initiate success")

		if fn, ok := goja.AssertFunction(runtime.Get("SSR")); ok {
			this.Callable = true
			this.fn = fn
		} else {
			util.Logger().WithField("error", err).Errorln("SSR function could not found")
			this.ready <- false
			return
		}
		util.Logger().Debugln("global.SSR found")
		this.ready <- true
	})

	return this, <-this.ready
}

func (this *JS) Exec(req map[string]interface{}) <-chan Result {
	defer func() {
		if err := recover(); err != nil {
			util.Logger().Errorln(err)
		}
	}()
	this.EventLoop.RunOnLoop(func(runtime *goja.Runtime) {
		param := runtime.ToValue(req)
		callback := runtime.ToValue(func(call goja.FunctionCall) goja.Value {
			util.Logger().Debugln("inner callback")

			m := call.Argument(0).Export().(map[string]interface{})
			util.Logger().WithFields(m).Debugln("render result")

			res := &Result{}
			err := mapstructure.Decode(m, res)
			if err != nil {
				util.Logger().WithField("error", err).Errorln("callback value decode error")
				this.err = err
				this.result <- *res
				return nil
			}
			this.result <- *res
			return nil
		})

		util.Logger().Debugln("start SSR")
		this.fn(nil, param, callback)
	})
	return this.result
}

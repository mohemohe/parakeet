package util

import (
	"github.com/mohemohe/parakeet/server/configs"
	"github.com/sirupsen/logrus"
)

var logger *logrus.Logger

func Logger() *logrus.Logger {
	switch {
	case logger == nil:
		logger = logrus.New()
		if configs.GetEnv().Echo.Env == "debug" {
			logger.SetLevel(logrus.DebugLevel)
		}
		fallthrough
	default:
		return logger
	}
}

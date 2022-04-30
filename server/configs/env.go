package configs

import (
	"github.com/kelseyhightower/envconfig"
)

type (
	EnvironmentVariable struct {
		Echo struct {
			Env string `default:"debug"`
		}
		Root struct {
			Password string `default:"root"`
		}
		Sign struct {
			Secret string `default:"parakeet"`
		}
		Mongo struct {
			Address  string `default:"mongodb://localhost:27017"`
			Database string `default:"parakeet"`
			SSL      bool   `default:"false"`
		}
	}
)

var cachedEnvironmentVariable *EnvironmentVariable

func GetEnv() EnvironmentVariable {
	if cachedEnvironmentVariable == nil {
		cachedEnvironmentVariable = new(EnvironmentVariable)
		envconfig.MustProcess("", cachedEnvironmentVariable)
	}

	return *cachedEnvironmentVariable
}

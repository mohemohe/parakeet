package configs

import (
	"time"
)

var unix *int64

func GetUnix() int64 {
	if unix == nil {
		u := time.Now().Unix()
		unix = &u
	}

	return *unix
}

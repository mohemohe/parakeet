package util

import (
	"golang.org/x/crypto/bcrypt"
)

func Bcrypt(s string) *string {
	if bytes, err := bcrypt.GenerateFromPassword([]byte(s), bcrypt.DefaultCost); err != nil {
		return nil
	} else {
		hash := string(bytes)
		return &hash
	}
}

func CompareHash(s string, h string) bool {
	if err := bcrypt.CompareHashAndPassword([]byte(h), []byte(s)); err == nil {
		return true
	} else {
		return false
	}
}

func IsBcrypt(s string) bool {
	_, err := bcrypt.Cost([]byte(s))
	return err == nil
}

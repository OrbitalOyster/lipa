package config

import (
	"log"
	"os"
	"strconv"
)

type Token struct {
	CookieName         string
	CookieLifetime     int
	CookieLongLifetime int
	TokenSecret        []byte
}

func (config *Token) Load() {
	config.CookieName = os.Getenv("COOKIE_NAME")
	var err error
	if config.CookieLifetime, err = strconv.Atoi(os.Getenv("COOKIE_LIFETIME")); err != nil {
		log.Fatalf("Unable to read cookie lifetime: %v", err)
	}
	if config.CookieLongLifetime, err = strconv.Atoi(os.Getenv("COOKIE_LONG_LIFETIME")); err != nil {
		log.Fatalf("Unable to read cookie long lifetime: %v", err)
	}
	config.TokenSecret = []byte(os.Getenv("TOKEN_SECRET"))
}

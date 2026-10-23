package main

import (
	"fmt"
	"log"
	"os"
	"strconv"
)

type PostgresConfig struct {
	User     string
	Password string
	Host     string
	Port     int
	Name     string
}

func (config *PostgresConfig) Load() {
	config.User = os.Getenv("DB_USER")
	if config.User == "" {
		log.Fatal("Missing DB user")
	}
	config.Password = os.Getenv("DB_PASSWORD")
	if config.Password == "" {
		log.Fatal("Missing DB password")
	}
	config.Host = os.Getenv("DB_HOST")
	if config.Host == "" {
		log.Fatal("Missing DB host")
	}
	config.Name = os.Getenv("DB_NAME")
	if config.Name == "" {
		log.Fatal("Missing DB name")
	}
	var err error
	config.Port, err = strconv.Atoi(os.Getenv("DB_PORT"))
	if err != nil {
		panic(fmt.Errorf("Unable to read DB port: %v", err))
	}
}

func (config PostgresConfig) String() string {
	return fmt.Sprintf(
		"postgres://%s:%s@%s:%d/%s",
		config.User,
		config.Password,
		config.Host,
		config.Port,
		config.Name,
	)
}

type HttpConfig struct {
	Port               int
	GinMode            string
	CookieName         string
	CookieLifetime     int
	CookieLongLifetime int
	TokenSecret        []byte
}

func (config *HttpConfig) Load() {
	var err error
	config.Port, err = strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		panic(fmt.Errorf("Unable to read http port: %v", err))
	}
	config.GinMode = os.Getenv("GIN_MODE")
	config.CookieName = os.Getenv("COOKIE_NAME")
	config.CookieLifetime, err = strconv.Atoi(os.Getenv("COOKIE_LIFETIME"))
	if err != nil {
		panic(fmt.Errorf("Unable to read cookie lifetime: %v", err))
	}
	config.CookieLongLifetime, err = strconv.Atoi(os.Getenv("COOKIE_LONG_LIFETIME"))
	if err != nil {
		panic(fmt.Errorf("Unable to read cookie long lifetime: %v", err))
	}
	config.TokenSecret = []byte(os.Getenv("TOKEN_SECRET"))
}

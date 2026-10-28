package config

import (
	"fmt"
	"log"
	"os"
	"strconv"
)

type Postgres struct {
	User     string
	Password string
	Host     string
	Port     int
	Name     string
}

func (config *Postgres) Load() {
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
		log.Fatalf("Unable to read DB port: %v", err)
	}
}

func (config Postgres) String() string {
	return fmt.Sprintf(
		"postgres://%s:%s@%s:%d/%s",
		config.User,
		config.Password,
		config.Host,
		config.Port,
		config.Name,
	)
}

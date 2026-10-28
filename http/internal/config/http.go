package config

import (
	"log"
	"os"
	"strconv"
)

type Http struct {
	Port    int
	GinMode string
}

func (config *Http) Load() {
	var err error
	config.Port, err = strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		log.Fatalf("Unable to read http port: %v", err)
	}
	config.GinMode = os.Getenv("GIN_MODE")
}

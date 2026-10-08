package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

var config HttpConfig
var postgresConfig PostgresConfig

func init() {
	config.Load()
	postgresConfig.Load()
}

func GetHome(ginContext *gin.Context) {
	ginContext.JSON(
		http.StatusOK,
		gin.H{"message": "hello"},
	)
}

func GetUser(ginContext *gin.Context) {
	pool, err := pgxpool.New(context.Background(), postgresConfig.String())
	if err != nil {
		panic("Unable to connect to DB" + err.Error())
	}
	defer pool.Close()

	var username string
	var password_hash string
	if err = pool.QueryRow(context.Background(), "SELECT * FROM lipa.users WHERE id = 100").Scan(nil, &username, &password_hash); err != nil {
		panic(err)
	} else {
		ginContext.JSON(
			http.StatusOK,
			gin.H{"user": username},
		)
	}
}

func CreateEngine() (engine *gin.Engine) {
	engine = gin.Default()
	engine.GET("/", GetHome)
	engine.GET("/user", GetUser)
	return
}

func main() {
	log.Printf("Starting http server on port %d", config.Port)
	CreateEngine().Run(fmt.Sprintf(":%d", config.Port))
}

package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

var config HttpConfig
var postgresConfig PostgresConfig

func init() {
	config.Load()
	postgresConfig.Load()
}

func GetUser() string {
	pool, err := pgxpool.New(context.Background(), postgresConfig.String())
	if err != nil {
		panic("Unable to connect to DB" + err.Error())
	}
	defer pool.Close()

	var username string
	var password_hash string
	const query = "SELECT * FROM lipa.users WHERE id = 100"
	if err = pool.QueryRow(context.Background(), query).Scan(nil, &username, &password_hash); err != nil {
		panic(err)
	} else {
		return username
	}
}

func GetLogin(ginContext *gin.Context) {
	ginContext.HTML(
		http.StatusOK,
		"login",
		gin.H{
			"Title": "Login",
			"Year":  time.Now().Year(),
		},
	)
}
func PostLogin(ginContext *gin.Context) {
	toast(ginContext, "Login", "Try again", info)
}

func GetHome(ginContext *gin.Context) {
	ginContext.HTML(
		http.StatusOK,
		"index",
		gin.H{
			"Title": "Main",
			"User": "Admin",
		},
	)
}

/* HTML renderer */
func CreateRenderer() (renderer multitemplate.Renderer) {
	const (
		masterLayout = "templates/layouts/master.html"
		partialsGlob = "templates/partials/*.html"
	)
	renderer = multitemplate.NewRenderer()
	/* Login page */
	renderer.AddFromFiles(
		"login",
		masterLayout,
		"templates/pages/login.html",
	)
	/* Main page */
	renderer.AddFromFiles(
		"index",
		masterLayout,
		"templates/pages/index.html",
	).ParseGlob(partialsGlob)
	/* Toast */
	renderer.AddFromFiles("toast", "templates/toast.html")
	return
}

func Throttle(ginContext *gin.Context) {
	if ginContext.GetHeader("HX-Request") == "true" {
		time.Sleep(time.Millisecond * 200)
	}
	ginContext.Next()
}

/* GIN engine */
func CreateEngine() (engine *gin.Engine) {
	engine = gin.Default()
	engine.HTMLRender = CreateRenderer()
	/* Middleware */
	engine.Use(Throttle)
	/* Routes */
	engine.GET("/login", GetLogin)
	engine.POST("/login", PostLogin)
	engine.GET("/", GetHome)
	return
}

func main() {
	log.Printf("Starting http server on port %d", config.Port)
	CreateEngine().Run(fmt.Sprintf(":%d", config.Port))
}

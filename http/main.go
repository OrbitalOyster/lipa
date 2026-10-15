package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
)

var config HttpConfig
var postgresConfig PostgresConfig

func init() {
	config.Load()
	postgresConfig.Load()
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
	username, _ := ginContext.GetPostForm("username")
	password, _ := ginContext.GetPostForm("password")
	userId := GetUserId(username, password)
	if userId > 0 {
		ginContext.Header("HX-Redirect", "/")
	} else {
		toast(ginContext, "Login", "Try again", warning)
	}
}

func GetHome(ginContext *gin.Context) {
	ginContext.HTML(
		http.StatusOK,
		"index",
		gin.H{
			"Title": "Main",
			"User":  "Admin",
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
	gin.SetMode(config.GinMode)
	engine = gin.New()
	engine.Use(gin.Recovery())
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
	log.Printf("Connecting to DB %s", postgresConfig.Name)
	ConnectPool()
	log.Printf("Starting http server on port %d", config.Port)
	CreateEngine().Run(fmt.Sprintf(":%d", config.Port))
}

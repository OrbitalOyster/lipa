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

func GetMain(ginContext *gin.Context) {
	username, ok := ginContext.Get("username")
	if !ok {
		panic("Username not exist on context")
	}
	ginContext.HTML(
		http.StatusOK,
		"main",
		gin.H{
			"Title": "Main",
			"User":  username,
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
		"main",
		masterLayout,
		"templates/pages/main.html",
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

func Auth(ginContext *gin.Context) {
	if cookie, err := ginContext.Cookie(config.CookieName); err != nil {
		log.Printf("Failed to load cookie: %v", err)
	} else {
		var claims, err = GetClaimsFromCookie(cookie)
		if err != nil {
			log.Printf("Failed to parse token: %v", err)
		} else {
			/* Success */
			claims.Save(ginContext)
			ginContext.Set("username", claims.Username)
			ginContext.Next()
			return
		}
	}
	ginContext.Redirect(http.StatusSeeOther, "/login")
	ginContext.Abort()
}

/* GIN engine */
func CreateEngine() (engine *gin.Engine) {
	gin.SetMode(config.GinMode)
	engine = gin.New()
	engine.Use(gin.Recovery())
	engine.HTMLRender = CreateRenderer()
	/* Middleware */
	engine.Use(Throttle)
	/* Public routes */
	engine.GET("/login", GetLogin)
	engine.POST("/login", PostLogin)
	/* Protected routes */
	protected := engine.Group("/")
	protected.Use(Auth)
	protected.GET("/", GetMain)
	protected.POST("/logout", PostLogout)
	return
}

func main() {
	log.Printf("Connecting to DB %s", postgresConfig.Name)
	ConnectPool()
	log.Printf("Starting http server on port %d", config.Port)
	CreateEngine().Run(fmt.Sprintf(":%d", config.Port))
}

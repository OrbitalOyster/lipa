package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var config HttpConfig
var postgresConfig PostgresConfig

func init() {
	config.Load()
	postgresConfig.Load()
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

func Auth(ginContext *gin.Context) {
	if cookie, err := ginContext.Cookie(config.CookieName); err != nil {
		log.Println("No cookie")
		// ginContext.Redirect(http.StatusSeeOther, "/login")
		// ginContext.JSON(http.StatusForbidden, "Nope")
	} else {
		var claims Claims
		_, err = jwt.ParseWithClaims(
			cookie,
			&claims,
			func(jwtToken *jwt.Token) (any, error) {
				if _, ok := jwtToken.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("Unexpected signing method: %v", jwtToken.Header["alg"])
				}
				return config.TokenSecret, nil
			},
		)
		if err != nil {
			log.Printf("Unable to parse token: %v", err)
		} else {
			ginContext.Next()
		}
	}
}

/* GIN engine */
func CreateEngine() (engine *gin.Engine) {
	gin.SetMode(config.GinMode)
	engine = gin.New()
	engine.Use(gin.Recovery())
	engine.HTMLRender = CreateRenderer()
	/* Middleware */
	engine.Use(Throttle)
	engine.Use(Auth)
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

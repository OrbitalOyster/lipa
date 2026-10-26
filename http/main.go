package main

import (
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"slices"
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
	name, ok := ginContext.Get("name")
	if !ok {
		panic("Name do not exist on context")
	}
	ginContext.HTML(
		http.StatusOK,
		"main",
		gin.H{
			"Title": "Main",
			"Name":  name,
		},
	)
}

var (
	templatesPath = "templates"
	layoutsPath   = filepath.Join(templatesPath, "layouts")
	dialogsPath   = filepath.Join(templatesPath, "dialogs", "*.html")
	dialogsGlob   []string
	partialsPath  = filepath.Join(templatesPath, "partials", "*.html")
	partialsGlob  []string
	pagesPath     = filepath.Join(templatesPath, "pages")
)

func InitTemplates() {
	var err error
	partialsGlob, err = filepath.Glob(partialsPath)
	if err != nil {
		panic(fmt.Errorf("Unable to load partials: %v", err))
	}
	dialogsGlob, err = filepath.Glob(dialogsPath)
	if err != nil {
		panic(fmt.Errorf("Unable to load dialogs: %v", err))
	}
}

func AddPage(renderer multitemplate.Renderer, name string, layout string, page string) {
	files := []string{
		filepath.Join(layoutsPath, layout),
		filepath.Join(pagesPath, page),
	}
	files = append(files, slices.Concat(partialsGlob, dialogsGlob)...)
	renderer.AddFromFiles(
		name,
		files...,
	)
}

/* HTML renderer */
func CreateRenderer() (renderer multitemplate.Renderer) {
	renderer = multitemplate.NewRenderer()
	InitTemplates()
	AddPage(renderer, "login", "master.html", "login.html")
	AddPage(renderer, "main", "master.html", "main.html")
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
			ginContext.Set("name", claims.Name)
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
	if config.GinMode == "debug" {
		engine.Use(gin.Logger())
	}
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

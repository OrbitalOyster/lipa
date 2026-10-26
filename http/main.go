package main

import (
	"fmt"
	"log"
	"path/filepath"
	"slices"

	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
)

var config HttpConfig
var postgresConfig PostgresConfig

var (
	templatesPath = "templates"
	layoutsPath   = filepath.Join(templatesPath, "layouts")
	partialsPath  = filepath.Join(templatesPath, "partials", "*.html")
	partialsGlob  []string
	dialogsPath   = filepath.Join(templatesPath, "dialogs", "*.html")
	dialogsGlob   []string
	pagesPath     = filepath.Join(templatesPath, "pages")
)

func init() {
	config.Load()
	postgresConfig.Load()
}

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
	/* layout + page ... */
	files := []string{
		filepath.Join(layoutsPath, layout),
		filepath.Join(pagesPath, page),
	}
	/* ... + partials + dialogs */
	files = append(files, slices.Concat(partialsGlob, dialogsGlob)...)
	renderer.AddFromFiles(name, files...)
}

/* HTML renderer */
func CreateRenderer() (renderer multitemplate.Renderer) {
	InitTemplates()
	renderer = multitemplate.NewRenderer()
	AddPage(renderer, "login", "master.html", "login.html")
	AddPage(renderer, "main", "master.html", "main.html")
	/* Toast */
	renderer.AddFromFiles("toast", "templates/toast.html")
	return
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

package app

import (
	"context"
	"lipa/internal/config"
	"lipa/internal/handlers"
	"log"
	"path/filepath"
	"slices"
	"strconv"
	"text/template"
	"time"

	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type App struct {
	httpConfig     config.Http
	tokenConfig    config.Token
	postgresConfig config.Postgres
	pool           *pgxpool.Pool
	engine         *gin.Engine
	renderer       multitemplate.Renderer
	layoutsPath    string
	pagesPath      string
	partialsGlob   []string
	dialogsGlob    []string
}

func (app *App) connectToDB() {
	var err error
	/* Parse connection string */
	pgxConfig, err := pgxpool.ParseConfig(app.postgresConfig.String())
	if err != nil {
		panic(err)
	}
	/* Custom options */
	pgxConfig.MaxConns = 16
	pgxConfig.MaxConnLifetime = time.Minute * 5
	pgxConfig.MaxConnIdleTime = time.Minute
	/* Create pool */
	app.pool, err = pgxpool.NewWithConfig(context.Background(), pgxConfig)
	if err != nil {
		log.Fatalf("Unable to connect to DB: %v", err.Error())
	}
}

const niceLookingDatetimeFormat = "2.01.2006 15:04:05"

/* FuncMap for HTML templates */
var templateFuncMap = template.FuncMap{
	/* Human-readable date formatting */
	"formatDate": func(t time.Time) string {
		return t.Format(niceLookingDatetimeFormat)
	},
}

func (app *App) initTemplates() {
	const templatesPath = "templates"
	app.pagesPath = filepath.Join(templatesPath, "pages")
	app.layoutsPath = filepath.Join(templatesPath, "layouts")
	var err error
	if app.partialsGlob, err = filepath.Glob(
		filepath.Join(templatesPath, "partials", "*.html"),
	); err != nil {
		log.Fatalf("Unable to load partials: %v", err)
	}
	if app.dialogsGlob, err = filepath.Glob(
		filepath.Join(templatesPath, "dialogs", "*.html"),
	); err != nil {
		log.Fatalf("Unable to load dialogs: %v", err)
	}
}

func (app *App) addPage(name string, layout string, page string) {
	/* layout + page ... */
	files := []string{
		filepath.Join(app.layoutsPath, layout),
		filepath.Join(app.pagesPath, page),
	}
	/* ... + partials + dialogs */
	files = append(files, slices.Concat(app.partialsGlob, app.dialogsGlob)...)
	app.renderer.AddFromFilesFuncs(name, templateFuncMap, files...)
}

/* GIN engine */
func (app *App) createEngine() {
	gin.SetMode(app.httpConfig.GinMode)
	app.engine = gin.New()
	if app.httpConfig.GinMode == "debug" {
		app.engine.Use(gin.Logger())
	}
	app.engine.Use(gin.Recovery())
	app.engine.HTMLRender = app.renderer
}

func (app *App) init() {
	log.Println("Initializing config...")
	app.httpConfig.Load()
	app.tokenConfig.Load()
	app.postgresConfig.Load()
	log.Println("Initializing HTML renderer...")
	app.initTemplates()
	app.renderer = multitemplate.NewRenderer()
	log.Printf("Connecting to %s", app.postgresConfig.Name)
	app.connectToDB()
	app.createEngine()
}

func Start() {
	var app App
	app.init()
	/* Middleware */
	app.engine.Use(handlers.Throttle)
	/* Public routes */
	app.engine.GET("/login", handlers.GetLogin(app.pool))
	app.engine.POST("/login", handlers.PostLogin(app.tokenConfig, app.pool))
	/* Protected routes */
	protected := app.engine.Group("/")
	protected.Use(handlers.Auth(app.tokenConfig))
	protected.GET("/", handlers.GetHome)
	protected.POST("/logout", handlers.PostLogout(app.tokenConfig))
	/* Toasts */
	app.renderer.AddFromFiles("toast", "templates/toast.html")
	/* Pages */
	app.addPage("login", "master.html", "login.html")
	app.addPage("main", "master.html", "main.html")
	/* Done */
	log.Printf("Starting http server on port %d", app.httpConfig.Port)
	app.engine.Run(":" + strconv.Itoa(app.httpConfig.Port))
}

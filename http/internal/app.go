package app

import (
	"context"
	"lipa/internal/config"
	"lipa/internal/handlers"
	"log"
	"path/filepath"
	"slices"
	"strconv"
	"time"

	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type App struct {
	httpConfig       config.Http
	tokenConfig      config.Token
	postgresConfig   config.Postgres
	pool             *pgxpool.Pool
	engine           *gin.Engine
	renderer         multitemplate.Renderer
	masterLayoutPath string
	layoutsPath      string
	pagesPath        string
	partialsGlob     []string
	dialogsGlob      []string
}

const (
	templatesPath = "templates"
	masterLayout  = "master.html"
)

func (app *App) connectToDB() {
	var err error
	/* Parse connection string */
	pgxConfig, err := pgxpool.ParseConfig(app.postgresConfig.String())
	/* Major screwup */
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

func (app *App) initTemplates() {
	app.pagesPath = filepath.Join(templatesPath, "pages")
	app.layoutsPath = filepath.Join(templatesPath, "layouts")
	app.masterLayoutPath = filepath.Join(app.layoutsPath, masterLayout)
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
	/* master layout + layout + page ... */
	files := []string{
		app.masterLayoutPath,
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
	protected.GET("/", handlers.GetHome(app.pool))
	protected.GET("/xlsx", handlers.GetXLSX(app.pool))
	protected.GET("/upload-xlsx", handlers.GetUploadXLSX(app.pool))
	protected.POST("/xlsx", handlers.PostXLSX())
	protected.GET("/orgs", handlers.GetOrgs(app.pool))
	protected.GET("/orgs/:id", handlers.GetOrg(app.pool))
	protected.GET("/org-list", handlers.GetOrgList(app.pool))
	protected.GET("/admin", handlers.GetAdmin)
	protected.POST("/logout", handlers.PostLogout(app.tokenConfig))
	/* Standalone partials */
	app.renderer.AddFromFiles("toast.html", "templates/partials/toast.html")
	app.renderer.AddFromFiles("org-list.html", "templates/partials/org-list.html")
	app.renderer.AddFromFiles("xlsx-upload-step-1.html", "templates/partials/xlsx-upload-step-1.html")
	/* Pages */
	app.addPage("login", "login.html", "login.html")
	app.addPage("home", "default.html", "home.html")
	app.addPage("xlsx", "default.html", "xlsx.html")
	app.addPage("upload-xlsx", "default.html", "upload-xlsx.html")
	app.addPage("orgs", "default.html", "orgs.html")
	app.addPage("org", "default.html", "org.html")
	app.addPage("admin", "default.html", "admin.html")
	/* Done */
	log.Printf("Starting http server on port %d", app.httpConfig.Port)
	app.engine.Run(":" + strconv.Itoa(app.httpConfig.Port))
}

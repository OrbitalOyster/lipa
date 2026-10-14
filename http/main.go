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
	toast(ginContext, "Login", "Try again")
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

func CreateEngine() (engine *gin.Engine) {
	/* HTML renderer */
	renderer := multitemplate.NewRenderer()
	renderer.AddFromFiles("login", "templates/layouts/master.html", "templates/pages/login.html")
	// renderer.AddFromFiles("index", "templates/layouts/master.html", "templates/pages/index.html", "templates/partials/navbar.html")
	renderer.AddFromFiles("index", "templates/layouts/master.html", "templates/pages/index.html").ParseGlob("templates/partials/*.html")
	renderer.AddFromFiles("toast", "templates/toast.html")
	/* GIN engine */
	engine = gin.Default()
	engine.HTMLRender = renderer
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

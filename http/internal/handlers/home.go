package handlers

import (
	"lipa/internal/model"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GetHome(pgxpool *pgxpool.Pool) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		name, exists := ginContext.Get("name")
		/* Major screwup */
		if !exists {
			log.Fatal("Name do not exist on context")
		}
		orgs := model.GetAllOrgs(pgxpool)
		ginContext.HTML(
			http.StatusOK,
			"main",
			gin.H{
				"Title": "Main",
				"Name":  name,
				"Today": time.Now(),
				"Orgs":  orgs,
			},
		)
	}
}

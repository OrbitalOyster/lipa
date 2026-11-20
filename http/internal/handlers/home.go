package handlers

import (
	"lipa/internal/model"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GetHome(pgxpool *pgxpool.Pool) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		name := ginContext.MustGet("name")
		orgs := model.GetOrgs(pgxpool, "")
		ginContext.HTML(
			http.StatusOK,
			"home",
			gin.H{
				"Title": "Главная",
				"Name":  name,
				"Today": time.Now(),
				"Orgs":  orgs,
			},
		)
	}
}

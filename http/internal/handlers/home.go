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
		username := ginContext.MustGet("Username")
		orgs := model.GetOrgs(pgxpool, "")
		ginContext.HTML(
			http.StatusOK,
			"home",
			gin.H{
				"Title":    "Главная",
				"Username": username,
				"Today":    time.Now(),
				"Orgs":     orgs,
			},
		)
	}
}

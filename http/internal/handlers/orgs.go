package handlers

import (
	"lipa/internal/model"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GetOrg(pgxpool *pgxpool.Pool, id int) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
	}
}

func GetOrgs(pgxpool *pgxpool.Pool) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		name := ginContext.MustGet("name")
		filterBy, _ := ginContext.Params.Get("filterBy")
		orgs := model.GetOrgs(pgxpool, filterBy)
		ginContext.HTML(
			http.StatusOK,
			"orgs",
			gin.H{
				"Title": "Организации",
				"Name":  name,
				"Orgs":  orgs,
			},
		)
	}
}

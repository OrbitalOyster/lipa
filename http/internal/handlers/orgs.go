package handlers

import (
	"lipa/internal/model"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GetOrg(pgxpool *pgxpool.Pool, id int) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
	}
}

func GetOrgsSidebar(pgxpool *pgxpool.Pool) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		log.Println("Here")
		filterBy, _ := ginContext.Params.Get("filterBy")
		orgs := model.GetOrgs(pgxpool, filterBy)
		ginContext.HTML(
			http.StatusOK,
			"sidebar-orgs",
			gin.H{
				"Orgs": orgs,
			},
		)
	}
}

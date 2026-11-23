package handlers

import (
	"lipa/internal/model"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GetOrg(pgxpool *pgxpool.Pool, id int) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
	}
}

func GetOrgList(pgxpool *pgxpool.Pool) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		filter := ginContext.Query("filter")
		orgs := model.GetOrgs(pgxpool, filter)
		ginContext.Header("HX-Push-Url", "/orgs?filter=" + url.QueryEscape(filter))
		ginContext.HTML(
			http.StatusOK,
			"org-list.html",
			gin.H{
				"Orgs":  orgs,
			},
		)
	}
}

func GetOrgs(pgxpool *pgxpool.Pool) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		name := ginContext.MustGet("name")
		filter := ginContext.Query("filter")
		orgs := model.GetOrgs(pgxpool, filter)
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

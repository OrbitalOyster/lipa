package handlers

import (
	"lipa/internal/model"
	"net/http"
	"net/url"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GetOrg(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		username := ginContext.MustGet("Username")
		idStr := ginContext.Param("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			ginContext.Status(http.StatusBadRequest)
			return
		}
		org, found := model.GetOrg(pool, id)
		if !found {
			ginContext.Status(http.StatusNotFound)
		} else {
			ginContext.HTML(
				http.StatusOK,
				"org",
				gin.H{
					"Title":    org.Name,
					"Username": username,
					"Org":      org,
				},
			)
		}
	}
}

func GetOrgList(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		filter := ginContext.Query("filter")
		orgs := model.GetOrgs(pool, filter)
		pushUrl := "/orgs"
		if filter != "" {
			pushUrl += "?filter=" + url.QueryEscape(filter)
		}
		ginContext.Header("HX-Push-Url", pushUrl)
		ginContext.HTML(
			http.StatusOK,
			"org-list.html",
			gin.H{
				"Orgs": orgs,
			},
		)
	}
}

func GetOrgs(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		username := ginContext.MustGet("Username")
		filter := ginContext.Query("filter")
		orgs := model.GetOrgs(pool, filter)
		ginContext.HTML(
			http.StatusOK,
			"orgs",
			gin.H{
				"Title":    "Организации",
				"Username": username,
				"Orgs":     orgs,
				"Filter":   filter,
			},
		)
	}
}

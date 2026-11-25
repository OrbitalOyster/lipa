package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAdmin(ginContext *gin.Context) {
	username := ginContext.MustGet("Username")
	ginContext.HTML(
		http.StatusOK,
		"admin",
		gin.H{
			"Title":    "Admin",
			"Username": username,
		},
	)
}

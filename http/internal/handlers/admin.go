package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAdmin(ginContext *gin.Context) {
	name, exists := ginContext.Get("name")
	/* Major screwup */
	if !exists {
		log.Fatal("Name do not exist on context")
	}
	ginContext.HTML(
		http.StatusOK,
		"admin",
		gin.H{
			"Title": "Admin",
			"Name":  name,
		},
	)
}

package handlers

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetHome(ginContext *gin.Context) {
	name, exists := ginContext.Get("name")
	/* Major screwup */
	if !exists {
		log.Fatal("Name do not exist on context")
	}
	ginContext.HTML(
		http.StatusOK,
		"main",
		gin.H{
			"Title": "Main",
			"Name":  name,
			"Today": time.Now(),
		},
	)
}

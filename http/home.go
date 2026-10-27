package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

/* Main */
func GetHome(ginContext *gin.Context) {
	name, ok := ginContext.Get("name")
	if !ok {
		panic("Name do not exist on context")
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

package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

/* Main */
func GetMain(ginContext *gin.Context) {
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
		},
	)
}

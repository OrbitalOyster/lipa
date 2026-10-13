package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

const toastTimeFormat = "2.01.2006 15:04:05"

func toast(ginContext *gin.Context, title string, content string) {
	ginContext.Header("HX-Trigger-After-Settle", "toast")
	ginContext.HTML(
		http.StatusOK,
		"toast.html",
		gin.H{
			"Title":   title,
			"Time":    time.Now().Format(toastTimeFormat),
			"Content": content,
		},
	)
}

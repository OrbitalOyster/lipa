package main

import (
	"maps"
	"net/http"
	"time"

	// "time"

	"github.com/gin-gonic/gin"
)

type ToastSeverity int

const (
	success ToastSeverity = iota
	info
	warning
	danger
)

const toastTimeFormat = "2.01.2006 15:04:05"

var severityData = map[ToastSeverity]map[string]string{
	success: {
		"Theme":     "success",
		"Autohide":  "true",
		"IconClass": "bi-hand-thumbs-up-fill",
	},
	info: {
		"Theme":     "info",
		"Autohide":  "true",
		"IconClass": "bi-info-circle-fill",
	},
	warning: {
		"Theme":     "warning",
		"Autohide":  "false",
		"IconClass": "bi-exclamation-triangle-fill",
	},
	danger: {
		"Theme":     "danger",
		"Autohide":  "false",
		"IconClass": "bi-x-octagon-fill",
	},
}

func toast(ginContext *gin.Context, title string, content string, severity ToastSeverity) {
	data := map[string]string{
		"Title":   title,
		"Content": content,
		"Time":    time.Now().Format(toastTimeFormat),
	}
	maps.Copy(data, severityData[severity])
	ginContext.Header("HX-Trigger-After-Settle", "toast")
	ginContext.HTML(
		http.StatusOK,
		"toast",
		data,
	)
}

package toasts

import (
	"maps"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type ToastSeverity int

const (
	Success ToastSeverity = iota
	Info
	Warning
	Danger
)

var styles = map[ToastSeverity]map[string]string{
	Success: {
		"Theme":     "success",
		"Autohide":  "true",
		"IconClass": "bi-hand-thumbs-up-fill",
	},
	Info: {
		"Theme":     "info",
		"Autohide":  "true",
		"IconClass": "bi-info-circle-fill",
	},
	Warning: {
		"Theme":     "warning",
		"Autohide":  "false",
		"IconClass": "bi-exclamation-triangle-fill",
	},
	Danger: {
		"Theme":     "danger",
		"Autohide":  "false",
		"IconClass": "bi-x-octagon-fill",
	},
}

func Send(ginContext *gin.Context, title string, content string, severity ToastSeverity) {
	data := map[string]string{
		"Title":   title,
		"Content": content,
		"Time":    time.Now().Format("2.01.2006 15:04:05"),
	}
	maps.Copy(data, styles[severity])
	ginContext.Header("HX-Trigger-After-Settle", "toast")
	ginContext.HTML(http.StatusOK, "toast", data)
}

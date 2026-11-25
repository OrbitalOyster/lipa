package handlers

import (
	"lipa/internal/model"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GetXLSX(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		username := ginContext.MustGet("Username")
		XLSXs := model.GetXLSXs(pool)
		ginContext.HTML(
			http.StatusOK,
			"xlsx",
			gin.H{
				"Username": username,
				"Title": "Файлики",
				"XLSXs": XLSXs,
			},
		)
	}
}

func PostXLSX() gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		log.Println("Uploaded")
		ginContext.HTML(http.StatusOK, "xlsx-upload-step-1.html", nil)
	}
}

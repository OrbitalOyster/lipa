package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GetXLSX(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		ginContext.HTML(
			http.StatusOK,
			"xlsx",
			gin.H{
				"Title": "Файлики",
			},
		)
	}
}

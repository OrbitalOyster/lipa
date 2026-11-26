package handlers

import (
	"crypto/sha256"
	"encoding/hex"
	"io"
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
				"Title":    "Файлики",
				"XLSXs":    XLSXs,
			},
		)
	}
}

func GetUploadXLSX(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		username := ginContext.MustGet("Username")
		ginContext.HTML(
			http.StatusOK,
			"upload-xlsx",
			gin.H{
				"Username": username,
				"Title":    "Загрузить .xlsx",
			},
		)
	}
}

func PostXLSX() gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		fileHeader, err := ginContext.FormFile("xlsx-file")
		if err != nil {
			panic(err)
		}
		filename := fileHeader.Filename
		log.Println("Uploaded:", filename)

		file, err := fileHeader.Open()
		if err != nil {
			panic(err)
		}
		defer file.Close()

		hasher := sha256.New()
		if _, err := io.Copy(hasher, file); err != nil {
			panic(err)
		}

		hash := hex.EncodeToString(hasher.Sum(nil))
		log.Println(hash)

		// ginContext.SaveUploadedFile(fileHeader, filepath.Join("tmp", filename))
		ginContext.HTML(
			http.StatusOK,
			"xlsx-upload-step-1.html",
			gin.H{
				"Filename": filename,
			},
		)
	}
}

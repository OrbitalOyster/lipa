package handlers

import (
	"lipa/internal/config"
	"lipa/internal/token"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func Throttle(ginContext *gin.Context) {
	if ginContext.GetHeader("HX-Request") == "true" {
		time.Sleep(time.Millisecond * 200)
	}
	ginContext.Next()
}

func Auth(tokenConfig config.Token) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		if cookie, err := ginContext.Cookie(tokenConfig.CookieName); err != nil {
			log.Printf("Failed to load cookie: %v", err)
		} else {
			claims, err := token.GetClaimsFromCookie(cookie, tokenConfig.TokenSecret)
			if err != nil {
				log.Printf("Failed to parse token: %v", err)
			} else {
				/* Success */
				claims.Save(
					ginContext,
					tokenConfig.CookieName,
					tokenConfig.TokenSecret,
				)
				ginContext.Set("name", claims.Name)
				ginContext.Next()
				return
			}
		}
		ginContext.Redirect(http.StatusSeeOther, "/login")
		ginContext.Abort()
	}
}

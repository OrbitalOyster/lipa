package main

import (
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

func Auth(ginContext *gin.Context) {
	if cookie, err := ginContext.Cookie(config.CookieName); err != nil {
		log.Printf("Failed to load cookie: %v", err)
	} else {
		var claims, err = GetClaimsFromCookie(cookie)
		if err != nil {
			log.Printf("Failed to parse token: %v", err)
		} else {
			/* Success */
			claims.Save(ginContext)
			ginContext.Set("name", claims.Name)
			ginContext.Next()
			return
		}
	}
	ginContext.Redirect(http.StatusSeeOther, "/login")
	ginContext.Abort()
}

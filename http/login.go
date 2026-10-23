package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type LoginRequest struct {
	Username   string `form:"username"`
	Password   string `form:"password"`
	RememberMe string `form:"remember-me"`
	IsUser     string `form:"is-user"`
}

type TokenPayload struct {
	UserID string `json:"user_id"`
}

func GetLogin(ginContext *gin.Context) {
	ginContext.HTML(
		http.StatusOK,
		"login",
		gin.H{
			"Title": "Login",
			"Orgs":  GetAllOrgs(),
			"Year":  time.Now().Year(),
		},
	)
}

func PostLogin(ginContext *gin.Context) {
	var loginRequest LoginRequest
	if err := ginContext.Bind(&loginRequest); err != nil {
		panic(err)
	}
	/* User */
	if loginRequest.IsUser == "true" {

	} else { /* Org */

	}

	userId := GetUserId(loginRequest.Username, loginRequest.Password)
	if userId > 0 {
		cookieLifetime := config.CookieLifetime
		if loginRequest.RememberMe == "true" {
			cookieLifetime = config.CookieLongLifetime
		}
		log.Printf("User %s logged in", loginRequest.Username)
		claims := CreateClaims(userId, loginRequest.Username, cookieLifetime)
		claims.Save(ginContext)
		ginContext.Header("HX-Redirect", "/")
		ginContext.Next()
	} else {
		toast(ginContext, "Login", "Try again", warning)
	}
}

func PostLogout(ginContext *gin.Context) {
	ginContext.SetCookie(config.CookieName, "", -1, "/", "", false, true)
	ginContext.Header("HX-Redirect", "/login")
	ginContext.Next()
}

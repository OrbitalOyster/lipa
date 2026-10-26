package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type LoginRequest struct {
	Username   string `form:"username"`
	OrgId      string `form:"org-id"`
	Password   string `form:"password"`
	RememberMe string `form:"remember-me"`
	IsOrg      string `form:"is-org"`
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
	cookieLifetime := config.CookieLifetime
	if loginRequest.RememberMe == "true" {
		cookieLifetime = config.CookieLongLifetime
	}
	var claims Claims
	/* User */
	if loginRequest.IsOrg == "false" {
		if userId := GetUserId(loginRequest.Username, loginRequest.Password); userId > 0 {
			log.Printf("User %s logged in", loginRequest.Username)
			claims = CreateClaims(userId, false, loginRequest.Username, cookieLifetime)
		}
	} else { /* Org */
		if orgId, name := GetOrg(loginRequest.OrgId, loginRequest.Password); orgId > 0 {
			log.Printf("Org %s logged in", loginRequest.OrgId)
			claims = CreateClaims(orgId, true, name, cookieLifetime)
		}
	}
	/* Success */
	if claims.ID > 0 {
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

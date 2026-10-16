package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type LoginRequest struct {
	Username   string `form:"username"`
	Password   string `form:"password"`
	RememberMe string `form:"remember-me"`
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
			"Year":  time.Now().Year(),
		},
	)
}

func PostLogin(ginContext *gin.Context) {
	var loginRequest LoginRequest
	if err := ginContext.Bind(&loginRequest); err != nil {
		panic(err)
	}
	userId := GetUserId(loginRequest.Username, loginRequest.Password)
	if userId > 0 {
		cookieLifetime := config.CookieLifetime
		if loginRequest.RememberMe == "true" {
			cookieLifetime = config.CookieLongLifetime
		}
		claims := CreateClaims(userId, loginRequest.Username, cookieLifetime)
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenStr, err := token.SignedString(config.TokenSecret)
		/* Major screwup */
		if err != nil {
			panic(err)
		}
		ginContext.SetSameSite(http.SameSiteStrictMode)
		ginContext.SetCookie(
			config.CookieName,
			tokenStr,
			cookieLifetime,
			"/",
			"",
			false,
			true,
		)
		ginContext.Header("HX-Redirect", "/")
	} else {
		toast(ginContext, "Login", "Try again", warning)
	}
}

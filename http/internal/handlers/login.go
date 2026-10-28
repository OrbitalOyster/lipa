package handlers

import (
	"lipa/internal/config"
	"lipa/internal/model"
	"lipa/internal/toasts"
	"lipa/internal/token"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type LoginRequest struct {
	Username   string `form:"username,default="`
	OrgId      string `form:"org-id,default=0"`
	Password   string `form:"password,default="`
	RememberMe string `form:"remember-me,default=false"`
	IsOrg      string `form:"is-org,default=true"`
}

func GetLogin(pgxpool *pgxpool.Pool) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		orgs := model.GetAllOrgs(pgxpool)
		ginContext.HTML(
			http.StatusOK,
			"login",
			gin.H{
				"Title": "Login",
				"Orgs":  orgs,
				"Year":  time.Now().Year(),
			},
		)
	}
}

func loginAttempt(tokenConfig config.Token, pool *pgxpool.Pool, loginRequest LoginRequest) (token.Claims, bool) {
	cookieLifetime := tokenConfig.CookieLifetime
	if loginRequest.RememberMe == "true" {
		cookieLifetime = tokenConfig.CookieLongLifetime
	}
	if loginRequest.IsOrg == "false" { /* User */
		if userId := model.GetUserId(pool, loginRequest.Username, loginRequest.Password); userId > 0 {
			log.Printf("User %s logged in", loginRequest.Username)
			return token.MakeClaims(userId, false, loginRequest.Username, cookieLifetime), true
		}
	} else { /* Org */
		if orgId, name := model.GetOrg(pool, loginRequest.OrgId, loginRequest.Password); orgId > 0 {
			log.Printf("Org %s logged in", loginRequest.OrgId)
			return token.MakeClaims(orgId, true, name, cookieLifetime), true
		}
	}
	return token.Claims{}, false
}

func PostLogin(tokenConfig config.Token, pool *pgxpool.Pool) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		var loginRequest LoginRequest
		if err := ginContext.Bind(&loginRequest); err != nil {
			/* Major screwup */
			log.Fatalf("Login request binding failed: %v", err)
		}
		if claims, success := loginAttempt(tokenConfig, pool, loginRequest); success {
			claims.Save(ginContext, tokenConfig.CookieName, tokenConfig.TokenSecret)
			ginContext.Header("HX-Redirect", "/")
			ginContext.Next()
		} else {
			toasts.Send(
				ginContext,
				"Login",
				"Try again",
				toasts.Warning,
			)
		}
	}
}

func PostLogout(tokenConfig config.Token) gin.HandlerFunc {
	return func(ginContext *gin.Context) {
		ginContext.SetCookie(
			tokenConfig.CookieName,
			"", -1, "/", "", false, true,
		)
		ginContext.Header("HX-Redirect", "/login")
		ginContext.Next()
	}
}

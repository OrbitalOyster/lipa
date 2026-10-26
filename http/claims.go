package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

/* JWT claims */
type Claims struct {
	UserID int    `json:"user_id"`
	IsOrg  bool   `json:"is_org"`
	Name   string `json:"name"`
	jwt.RegisteredClaims
}

func CreateClaims(userId int, isOrg bool, name string, lifetime int) (claims Claims) {
	claims.UserID = userId
	claims.IsOrg = isOrg
	claims.Name = name
	claims.SetLifetime(lifetime)
	return
}

func (claims Claims) Save(ginContext *gin.Context) {
	lifetime := claims.GetLifetime()
	claims.SetLifetime(lifetime)
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
		lifetime,
		"/",
		"",
		false,
		true,
	)
}

func GetClaimsFromCookie(cookie string) (claims Claims, err error) {
	_, err = jwt.ParseWithClaims(
		cookie,
		&claims,
		func(jwtToken *jwt.Token) (any, error) {
			if _, ok := jwtToken.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", jwtToken.Header["alg"])
			}
			return config.TokenSecret, nil
		},
	)
	return
}

func (claims *Claims) SetLifetime(lifetime int) {
	issuedAt := time.Now()
	expires := issuedAt.Add(time.Duration(lifetime) * time.Second)
	claims.IssuedAt = jwt.NewNumericDate(issuedAt)
	claims.NotBefore = claims.IssuedAt
	claims.ExpiresAt = jwt.NewNumericDate(expires)
}

func (claims Claims) GetLifetime() (seconds int) {
	secondsFloat := claims.ExpiresAt.Time. /* Get expiration date */
						Sub(claims.IssuedAt.Time). /* Substract "issued at" date */
						Seconds()                  /* Convert to seconds */
	return int(secondsFloat)
}

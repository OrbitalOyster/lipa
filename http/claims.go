package main

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

/* JWT claims */
type Claims struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func CreateClaims(UserId int, Username string, lifetime int) (claims Claims) {
	claims.UserID = UserId
	claims.Username = Username
	claims.SetLifetime(lifetime)
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

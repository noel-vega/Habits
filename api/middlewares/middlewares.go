// Package middlewares
package middlewares

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID int `json:"user_id"`
	jwt.RegisteredClaims
}

func Guard(c *gin.Context) {
	refreshTokenStr, err := c.Cookie("refreshToken")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid refresh token: " + err.Error()})
	}
	refreshToken, err := jwt.Parse(refreshTokenStr, func(token *jwt.Token) (any, error) {
		return []byte("secret"), nil
	})
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token: " + err.Error()})
		return
	}

	if !refreshToken.Valid {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		return
	}

	authHeader := c.GetHeader("Authorization")

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (any, error) {
		return []byte("secret"), nil
	})
	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			fmt.Println("ACCESS TOKEN EXPIRED")
		}
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token: " + err.Error()})
		return
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		fmt.Println("TOKEN INVALID")
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token claims"})
		return
	}

	c.Set("user_id", claims.UserID)
	c.Next()
}

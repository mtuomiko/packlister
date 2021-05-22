package auth

import (
	"fmt"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	jwt "gopkg.in/dgrijalva/jwt-go.v3"

	"github.com/mtuomiko/packlister/graphql/model"
)

type JwtWrapper struct {
	SecretKey       string
	ExpirationHours int64
}

type JwtClaim struct {
	UserID   string
	Username string
	Email    string
	jwt.StandardClaims
}

func (j *JwtWrapper) GenerateToken(user *model.User) (signedToken string, err error) {
	claims := JwtClaim{
		UserID:   user.ID,
		Username: user.Username,
		Email:    user.Email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(j.ExpirationHours)).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err = token.SignedString([]byte(j.SecretKey))
	if err != nil {
		return "", err
	}
	return signedToken, nil
}

func (j *JwtWrapper) ValidateToken(signedToken string) (claims *JwtClaim, err error) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&JwtClaim{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(j.SecretKey), nil
		},
	)
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(*JwtClaim)
	if !ok {
		return nil, fmt.Errorf("claims parsing failed")
	}
	if claims.ExpiresAt < time.Now().Local().Unix() {
		return nil, fmt.Errorf("token is expired")
	}
	return claims, nil
}

func AuthMiddleware(jwt JwtWrapper) gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		if auth == "" {
			return
		}
		if !strings.HasPrefix(strings.ToLower(auth), "bearer ") {
			return
		}
		claims, err := jwt.ValidateToken(auth[7:])
		if err != nil {
			return
		}
		c.Set("claims", claims)
		c.Next()
	}
}

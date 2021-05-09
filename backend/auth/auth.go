package auth

import (
	"fmt"
	"time"

	"github.com/mtuomiko/packlister/graphql/model"
	jwt "gopkg.in/dgrijalva/jwt-go.v3"
)

type JwtWrapper struct {
	SecretKey       string
	ExpirationHours int64
}

type JwtClaim struct {
	Username string
	Email    string
	jwt.StandardClaims
}

func (j *JwtWrapper) GenerateToken(user *model.User) (signedToken string, err error) {
	claims := &JwtClaim{
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

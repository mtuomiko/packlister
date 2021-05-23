package resolver

//go:generate go run github.com/99designs/gqlgen
import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/mtuomiko/packlister/auth"
	"github.com/mtuomiko/packlister/db"
)

type Resolver struct {
	DB        db.DB               // Interface
	Validator *validator.Validate // Validator docs suggest using single instance to allow struct caching
	Jwt       *auth.JwtWrapper
}

func GinContextFromContext(ctx context.Context) (*gin.Context, error) {
	ginContext := ctx.Value("GinContextKey")
	if ginContext == nil {
		return nil, fmt.Errorf("could not retrieve gin.Context")
	}
	gc, ok := ginContext.(*gin.Context)
	if !ok {
		return nil, fmt.Errorf("gin.Context has wrong type")
	}
	return gc, nil
}

func GetClaimsFromGinContext(ctx context.Context) (*auth.JwtClaim, error) {
	ginContext, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}
	rawClaims, ok := ginContext.Get("claims")
	if !ok {
		return nil, fmt.Errorf("claims not found in gin.Context")
	}
	claims, ok := rawClaims.(*auth.JwtClaim)
	if !ok {
		return nil, fmt.Errorf("claims type assertion failed")
	}
	return claims, nil
}

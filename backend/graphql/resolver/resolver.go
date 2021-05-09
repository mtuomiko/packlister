package resolver

//go:generate go run github.com/99designs/gqlgen
import (
	"github.com/go-playground/validator"
	"github.com/mtuomiko/packlister/auth"
	"github.com/mtuomiko/packlister/db"
)

type Resolver struct {
	DB        db.DB
	Validator *validator.Validate // Validator docs suggest using single instance for struct caching
	Jwt       auth.JwtWrapper
}

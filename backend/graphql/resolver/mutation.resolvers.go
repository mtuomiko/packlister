package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/mtuomiko/packlister/auth"
	"github.com/mtuomiko/packlister/graphql/generated"
	"github.com/mtuomiko/packlister/graphql/model"
	"golang.org/x/crypto/bcrypt"
)

func (r *mutationResolver) CreatePacklist(ctx context.Context, input model.NewPacklist) (*model.Packlist, error) {
	gc, err := GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}
	raw, ok := gc.Get("claims")
	if !ok {
		return nil, fmt.Errorf("auth failed")
	}
	claims, ok := raw.(*auth.JwtClaim)
	if !ok {
		return nil, fmt.Errorf("auth failed")
	}
	user, err := r.DB.FindUserByUsername(claims.Username)
	if err != nil {
		return nil, fmt.Errorf("auth failed")
	}
	packlist := model.Packlist{
		Slug:        input.Slug,
		Name:        input.Name,
		Description: input.Description,
		UserID:      user.ID,
	}
	return r.DB.CreatePacklist(packlist)
}

func (r *mutationResolver) CreateUser(ctx context.Context, input model.NewUser) (*model.User, error) {
	err := r.Validator.Struct(input)
	if err != nil {
		return nil, err
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	user := model.User{
		Username:     input.Username,
		Email:        input.Email,
		PasswordHash: string(hashedPassword),
	}
	return r.DB.CreateUser(user)
}

func (r *mutationResolver) Login(ctx context.Context, input *model.LoginInput) (*model.Token, error) {
	err := r.Validator.Struct(input)
	if err != nil {
		return nil, err
	}
	user, err := r.DB.FindUserByUsername(input.Username)
	if err != nil {
		return nil, fmt.Errorf("login failed")
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password))
	if err != nil {
		return nil, fmt.Errorf("login failed")
	}
	signedToken, err := r.Jwt.GenerateToken(user)
	if err != nil {
		return nil, fmt.Errorf("login failed")
	}
	token := model.Token{
		Value: signedToken,
	}
	return &token, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }

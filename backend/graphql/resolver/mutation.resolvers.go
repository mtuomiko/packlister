package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/mtuomiko/packlister/graphql/generated"
	"github.com/mtuomiko/packlister/graphql/model"
	"golang.org/x/crypto/bcrypt"
)

func (r *mutationResolver) CreatePacklist(ctx context.Context, input model.NewPacklist) (*model.Packlist, error) {
	claims, err := GetClaimsFromGinContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("auth failed")
	}
	packlist := model.Packlist{
		Name:   input.Name,
		UserID: claims.UserID,
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

func (r *mutationResolver) Login(ctx context.Context, credentials model.LoginInput) (*model.LoginResponse, error) {
	err := r.Validator.Struct(credentials)
	if err != nil {
		return nil, err
	}
	user, err := r.DB.FindUserByUsername(credentials.Username)
	if err != nil {
		return nil, fmt.Errorf("login failed")
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(credentials.Password))
	if err != nil {
		return nil, fmt.Errorf("login failed")
	}
	signedToken, err := r.Jwt.GenerateToken(user)
	if err != nil {
		return nil, fmt.Errorf("login failed")
	}
	token := model.LoginResponse{
		Token: signedToken,
		User:  user,
	}
	return &token, nil
}

func (r *mutationResolver) UpdateState(ctx context.Context, userItems []*model.UserItemInput, packlist *model.PacklistInput) (bool, error) {
	claims, err := GetClaimsFromGinContext(ctx)
	if err != nil {
		return false, fmt.Errorf("auth failed")
	}
	err = r.DB.UpdateUserItems(claims.UserID, userItems)
	if err != nil {
		return false, err
	}
	if packlist != nil {
		err = r.DB.UpdatePacklist(packlist)
		if err != nil {
			return false, err
		}
	}
	return true, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }

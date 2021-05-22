package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/mtuomiko/packlister/graphql/generated"
	"github.com/mtuomiko/packlister/graphql/model"
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
	user := model.User{
		Username: input.Username,
		Email:    input.Email,
	}
	err = user.SetPassword(input.Password)

	if err != nil {
		return nil, err
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
	if !user.IsPasswordCorrect(credentials.Password) {
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

func (r *mutationResolver) UpdateState(ctx context.Context, userItems []*model.UserItemInput, packlist *model.PacklistInput) (*model.UpdateResponse, error) {
	claims, err := GetClaimsFromGinContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("auth failed")
	}
	err = r.DB.UpdateUserItems(claims.UserID, userItems)
	if err != nil {
		return nil, err
	}
	if packlist != nil {
		err = r.DB.UpdatePacklist(packlist)
		if err != nil {
			return nil, err
		}
	}
	return &model.UpdateResponse{Success: true}, nil
}

func (r *mutationResolver) ChangePassword(ctx context.Context, passwords *model.ChangePasswordInput) (*model.User, error) {
	claims, err := GetClaimsFromGinContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("auth failed")
	}
	user, err := r.DB.FindOneUser(claims.UserID)
	if err != nil {
		return nil, fmt.Errorf("auth failed")
	}
	if !user.IsPasswordCorrect(passwords.OldPassword) {
		return nil, fmt.Errorf("old password not correct")
	}
	if err = user.SetPassword(passwords.NewPassword); err != nil {
		return nil, fmt.Errorf("new password failed")
	}
	return r.DB.UpdateUser(user)
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }

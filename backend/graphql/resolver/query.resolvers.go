package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/mtuomiko/packlister/graphql/generated"
	"github.com/mtuomiko/packlister/graphql/model"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (r *queryResolver) AllPacklists(ctx context.Context) ([]*model.Packlist, error) {
	return r.DB.GetAllPacklists()
}

func (r *queryResolver) FindPacklist(ctx context.Context, id primitive.ObjectID) (*model.Packlist, error) {
	return r.DB.FindOnePacklist(id)
}

func (r *queryResolver) AllUsers(ctx context.Context) ([]*model.User, error) {
	return r.DB.GetAllUsers()
}

func (r *queryResolver) FindUser(ctx context.Context, id primitive.ObjectID) (*model.User, error) {
	return r.DB.FindOneUser(id)
}

func (r *queryResolver) GetAuthorizedUser(ctx context.Context) (*model.User, error) {
	claims, err := GetClaimsFromGinContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("auth failed")
	}
	res, err := r.DB.FindOneUser(claims.UserID)
	if err != nil {
		return nil, err
	}
	return res, nil
}

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type queryResolver struct{ *Resolver }

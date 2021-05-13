package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/mtuomiko/packlister/graphql/generated"
	"github.com/mtuomiko/packlister/graphql/model"
)

func (r *packlistResolver) User(ctx context.Context, obj *model.Packlist) (*model.User, error) {
	return r.DB.FindOneUser(obj.UserID)
}

func (r *packlistResolver) Categories(ctx context.Context, obj *model.Packlist) ([]*model.Category, error) {
	return obj.Categories, nil
}

// Packlist returns generated.PacklistResolver implementation.
func (r *Resolver) Packlist() generated.PacklistResolver { return &packlistResolver{r} }

type packlistResolver struct{ *Resolver }

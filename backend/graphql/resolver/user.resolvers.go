package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/mtuomiko/packlister/graphql/generated"
	"github.com/mtuomiko/packlister/graphql/model"
)

func (r *userResolver) Packlists(ctx context.Context, obj *model.User) ([]*model.Packlist, error) {
	fmt.Println("doing this")
	return r.DB.FindPacklistsByUserId(obj.ID)
}

func (r *userResolver) UserItems(ctx context.Context, obj *model.User) ([]*model.UserItem, error) {
	return obj.UserItems, nil
}

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type userResolver struct{ *Resolver }

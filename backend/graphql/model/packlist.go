package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Packlist struct {
	ID          primitive.ObjectID `json:"id" bson:"_id"`
	Slug        string             `json:"slug"`
	Name        string             `json:"name"`
	Description *string            `json:"description"`
	UserID      primitive.ObjectID `json:"user" bson:"user"`
}

package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID           primitive.ObjectID `validate:"required" json:"id" bson:"_id"`
	Username     string             `validate:"required,min=3" json:"username"`
	Email        string             `validate:"required,email" json:"email"`
	PasswordHash string             `validate:"required" json:"passwordHash"`
}

type NewUser struct {
	Username string `validate:"required,min=3" json:"username"`
	Email    string `validate:"required,email" json:"email"`
	Password string `validate:"required,min=8" json:"password"`
}

type LoginInput struct {
	Username string `validate:"required" json:"username"`
	Password string `validate:"required" json:"password"`
}

package model

import (
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID           string      `validate:"required" json:"id" bson:"_id"`
	Username     string      `validate:"required,min=3" json:"username"`
	Email        string      `validate:"required,email" json:"email"`
	PasswordHash string      `validate:"required" json:"-"`
	UserItems    []*UserItem `json:"userItems"`
	// PacklistIDs  []primitive.ObjectID `json:"packlists" bson:"packlists"`
}

func (user *User) SetPassword(password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.PasswordHash = string(hashedPassword)
	return nil
}

func (user *User) IsPasswordCorrect(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	return err == nil
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

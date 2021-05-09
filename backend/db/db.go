package db

import (
	"context"
	"fmt"

	"github.com/mtuomiko/packlister/graphql/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type DB interface {
	GetAllPacklists() ([]*model.Packlist, error)
	CreatePacklist(input model.NewPacklist) (*model.Packlist, error)
	FindOnePacklist(objectId primitive.ObjectID) (*model.Packlist, error)
	GetAllUsers() ([]*model.User, error)
	FindOneUser(objectId primitive.ObjectID) (*model.User, error)
	FindPacklistsByUserId(userId primitive.ObjectID) ([]*model.Packlist, error)
	CreateUser(input model.User) (*model.User, error)
	FindUserByUsername(username string) (*model.User, error)
}

type MongoDB struct {
	packlists *mongo.Collection
	users     *mongo.Collection
}

func New(client *mongo.Client) *MongoDB {
	packlists := client.Database("packlister").Collection("packlists")
	users := client.Database("packlister").Collection("users")
	return &MongoDB{
		packlists: packlists,
		users:     users,
	}
}

func (db MongoDB) GetAllPacklists() ([]*model.Packlist, error) {
	res, err := db.packlists.Find(context.TODO(), bson.D{{}})
	if err != nil {
		return nil, fmt.Errorf("error finding packlists")
	}
	var packlists []*model.Packlist
	err = res.All(context.TODO(), &packlists)
	if err != nil {
		return nil, fmt.Errorf("error consuming packlist cursor")
	}
	return packlists, nil
}

func (db MongoDB) CreatePacklist(input model.NewPacklist) (*model.Packlist, error) {
	insertResult, err := db.packlists.InsertOne(context.TODO(), bson.D{
		{Key: "slug", Value: input.Slug},
		{Key: "name", Value: input.Name},
		{Key: "description", Value: input.Description},
		{Key: "user", Value: input.User},
	})
	if err != nil {
		return nil, fmt.Errorf("error inserting packlist")
	}
	objectId, ok := insertResult.InsertedID.(primitive.ObjectID)
	if !ok {
		return nil, fmt.Errorf("did not receive proper ObjectID for created packlist")
	}
	return FindPacklistById(db, objectId)
}

func (db MongoDB) FindOnePacklist(objectId primitive.ObjectID) (*model.Packlist, error) {
	return FindPacklistById(db, objectId)
}

func (db MongoDB) GetAllUsers() ([]*model.User, error) {
	res, err := db.users.Find(context.TODO(), bson.D{{}})
	if err != nil {
		return nil, fmt.Errorf("error finding users")
	}
	var users []*model.User
	err = res.All(context.TODO(), &users)
	if err != nil {
		return nil, fmt.Errorf("error consuming packlist cursor")
	}
	return users, nil
}

func (db MongoDB) FindOneUser(objectId primitive.ObjectID) (*model.User, error) {
	return FindUserById(db, objectId)
}

func (db MongoDB) FindPacklistsByUserId(userId primitive.ObjectID) ([]*model.Packlist, error) {
	res, err := db.packlists.Find(context.TODO(), bson.D{{
		Key:   "user",
		Value: userId,
	}})
	if err != nil {
		return nil, fmt.Errorf("error finding packlists")
	}
	var packlists []*model.Packlist
	err = res.All(context.TODO(), &packlists)
	if err != nil {
		return nil, fmt.Errorf("error consuming packlist cursor")
	}
	return packlists, nil
}

func (db MongoDB) CreateUser(input model.User) (*model.User, error) {
	insertResult, err := db.users.InsertOne(context.TODO(), bson.D{
		{Key: "username", Value: input.Username},
		{Key: "email", Value: input.Email},
		{Key: "passwordHash", Value: input.PasswordHash},
	})
	if err != nil {
		return nil, fmt.Errorf("error inserting user")
	}
	objectId, ok := insertResult.InsertedID.(primitive.ObjectID)
	if !ok {
		return nil, fmt.Errorf("did not receive proper ObjectID for created user")
	}
	return FindUserById(db, objectId)
}

func (db MongoDB) FindUserByUsername(username string) (*model.User, error) {
	var user *model.User
	findResult := db.users.FindOne(context.TODO(),
		bson.D{{
			Key:   "username",
			Value: username,
		}},
	)
	if err := findResult.Decode(&user); err != nil {
		return nil, fmt.Errorf("user not found")
	}
	return user, nil
}

func FindPacklistById(db MongoDB, objectId primitive.ObjectID) (*model.Packlist, error) {
	var packlist *model.Packlist
	findResult := db.packlists.FindOne(context.TODO(),
		bson.D{{
			Key:   "_id",
			Value: objectId,
		}},
	)
	if err := findResult.Decode(&packlist); err != nil {
		return nil, fmt.Errorf("packlist not found")
	}
	return packlist, nil
}

func FindUserById(db MongoDB, objectId primitive.ObjectID) (*model.User, error) {
	var user *model.User
	findResult := db.users.FindOne(context.TODO(),
		bson.D{{
			Key:   "_id",
			Value: objectId,
		}},
	)
	if err := findResult.Decode(&user); err != nil {
		return nil, fmt.Errorf("user not found")
	}
	return user, nil
}

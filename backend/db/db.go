package db

import (
	"context"
	"fmt"
	"log"

	"github.com/mtuomiko/packlister/graphql/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DB interface {
	GetAllPacklists() ([]*model.Packlist, error)
	CreatePacklist(input model.Packlist) (*model.Packlist, error)
	FindOnePacklist(id string) (*model.Packlist, error)
	GetAllUsers() ([]*model.User, error)
	FindOneUser(id string) (*model.User, error)
	FindPacklistsByUserId(id string) ([]*model.Packlist, error)
	CreateUser(input model.User) (*model.User, error)
	FindUserByUsername(username string) (*model.User, error)
	UpdateUser(user *model.User) (*model.User, error)
	UpdateUserItems(id string, userItems []*model.UserItemInput) error
	UpdatePacklist(packlist *model.PacklistInput) error
	EnsureIndexes() error
}

type MongoDB struct {
	packlists *mongo.Collection
	users     *mongo.Collection
}

var client *mongo.Client

func ConnectClient(databaseURI string) {
	clientOptions := options.Client().ApplyURI(databaseURI)
	var err error
	client, err = mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Connected to MongoDB!")
}

func DisconnectClient() {
	if client == nil {
		return
	}
	err := client.Disconnect(context.TODO())
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Disconnected from MongoDB")
}

func New() *MongoDB {
	if client == nil {
		return nil
	}
	packlists := client.Database("packlister").Collection("packlists")
	users := client.Database("packlister").Collection("users")
	return &MongoDB{
		packlists: packlists,
		users:     users,
	}
}

func (db MongoDB) EnsureIndexes() error {
	indexModels := []mongo.IndexModel{
		CreateUniqueIndexModel("username"),
		CreateUniqueIndexModel("email"),
	}
	_, err := db.users.Indexes().CreateMany(context.TODO(), indexModels)
	if err != nil {
		return err
	}
	return nil
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

func (db MongoDB) CreatePacklist(input model.Packlist) (*model.Packlist, error) {
	insertResult, err := db.packlists.InsertOne(context.TODO(), input)
	if err != nil {
		return nil, fmt.Errorf("error inserting packlist")
	}
	objectId, ok := insertResult.InsertedID.(primitive.ObjectID)
	if !ok {
		return nil, fmt.Errorf("did not receive proper ObjectID for created packlist")
	}
	return findPacklistById(db, objectId.Hex())
}

func (db MongoDB) FindOnePacklist(id string) (*model.Packlist, error) {
	return findPacklistById(db, id)
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

func (db MongoDB) FindOneUser(id string) (*model.User, error) {
	return findUserById(db, id)
}

func (db MongoDB) FindPacklistsByUserId(id string) ([]*model.Packlist, error) {
	objectId, err := hexStringToObjectID(id)
	if err != nil {
		return nil, err
	}

	res, err := db.packlists.Find(context.TODO(), bson.D{{
		Key:   "user",
		Value: objectId,
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
		// return nil, fmt.Errorf("error inserting user")
		return nil, err
	}
	objectId, ok := insertResult.InsertedID.(primitive.ObjectID)
	if !ok {
		return nil, fmt.Errorf("did not receive proper ObjectID for created user")
	}
	return findUserById(db, objectId.Hex())
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

func (db MongoDB) UpdateUser(user *model.User) (*model.User, error) {
	res, err := db.users.ReplaceOne(context.TODO(),
		bson.M{"username": user.Username},
		user,
	)
	if err != nil {
		return nil, err
	}
	if res.MatchedCount != 1 {
		return nil, fmt.Errorf("user not found for update")
	}
	return user, nil
}

func (db MongoDB) UpdateUserItems(id string, userItems []*model.UserItemInput) error {
	objectId, err := hexStringToObjectID(id)
	if err != nil {
		return err
	}
	res, err := db.users.UpdateByID(context.TODO(), objectId,
		bson.D{
			{"$set", bson.D{
				{"userItems", userItems},
			}},
		},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount != 1 {
		return fmt.Errorf("did not find userItems to update")
	}
	return nil
}

func (db MongoDB) UpdatePacklist(packlist *model.PacklistInput) error {
	objectId, err := hexStringToObjectID(packlist.ID)
	if err != nil {
		return err
	}

	res, err := db.packlists.UpdateByID(context.TODO(), objectId,
		bson.D{
			{"$set", bson.D{
				{"name", packlist.Name},
				{"description", packlist.Description},
				{"categories", packlist.Categories},
			}},
		},
	)
	if err != nil {
		return err
	}
	if res.MatchedCount != 1 {
		return fmt.Errorf("did not find packlist to update")
	}
	return nil
}

func findPacklistById(db MongoDB, id string) (*model.Packlist, error) {
	objectId, err := hexStringToObjectID(id)
	if err != nil {
		return nil, err
	}

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

func findUserById(db MongoDB, id string) (*model.User, error) {
	objectId, err := hexStringToObjectID(id)
	if err != nil {
		return nil, err
	}

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

func hexStringToObjectID(str string) (primitive.ObjectID, error) {
	objectId, err := primitive.ObjectIDFromHex(str)
	if err != nil {
		return primitive.NilObjectID, fmt.Errorf("objectid conversion from string failed")
	}
	return objectId, nil
}

func CreateUniqueIndexModel(field string) mongo.IndexModel {
	return mongo.IndexModel{
		Keys: bson.D{{
			Key:   field,
			Value: 1,
		}},
		Options: options.Index().SetUnique(true),
	}
}

package tests

import (
	"context"
	"log"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/mtuomiko/packlister/application"
	"github.com/mtuomiko/packlister/config"
	"github.com/mtuomiko/packlister/db"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var router *gin.Engine
var client *mongo.Client

func TestMain(m *testing.M) {
	os.Exit(testMain(m))
}

func testMain(m *testing.M) int {
	_ = godotenv.Load("../.env")
	cfg := config.GetConfig()

	if cfg.Environment != "test" {
		log.Println("tests only run in test environment")
		return 1
	}

	err := db.ConnectClient(cfg.DatabaseURI)
	if err != nil {
		log.Println(err)
		return 1
	}
	defer db.DisconnectClient()

	client = db.GetClient()
	if client == nil {
		log.Println("mongodb client not initialized")
		return 1
	}
	if err = resetCollections(); err != nil {
		log.Println(err)
		return 1
	}

	router = application.Setup(cfg)

	return m.Run()
}

func resetCollections() error {
	_, err := client.Database("packlister").Collection("users").DeleteMany(context.TODO(), bson.M{})
	if err != nil {
		return err
	}
	_, err = client.Database("packlister").Collection("packlists").DeleteMany(context.TODO(), bson.M{})
	if err != nil {
		return err
	}
	return nil
}

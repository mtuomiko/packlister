package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-playground/validator"
	"github.com/joho/godotenv"
	"github.com/mtuomiko/packlister/auth"
	"github.com/mtuomiko/packlister/db"
	"github.com/mtuomiko/packlister/graphql/generated"
	"github.com/mtuomiko/packlister/graphql/resolver"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const defaultPort = "8080"

func main() {
	_ = godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET not present or empty")
	}

	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	log.Printf("Connecting to %s", clientOptions.GetURI())
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Connected to MongoDB!")

	defer client.Disconnect(context.TODO())
	http.Handle("/query", gqlHandler(db.New(client)))
	http.Handle("/playground", playground.Handler("GraphQL playground", "/query"))
	err = http.ListenAndServe(":8080", nil)
	log.Fatal(err)
}

func gqlHandler(db db.DB) *handler.Server {
	config := generated.Config{
		Resolvers: &resolver.Resolver{
			DB:        db,
			Validator: validator.New(),
			Jwt: auth.JwtWrapper{
				SecretKey:       os.Getenv("JWT_SECRET"),
				ExpirationHours: 240,
			},
		},
	}
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(config))

	return srv
}

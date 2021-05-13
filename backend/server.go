package main

import (
	"context"
	"log"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/mtuomiko/packlister/auth"
	"github.com/mtuomiko/packlister/db"
	"github.com/mtuomiko/packlister/graphql/generated"
	"github.com/mtuomiko/packlister/graphql/resolver"
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
		log.Fatal("JWT_SECRET env var not present or empty")
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

	jwt := auth.JwtWrapper{
		SecretKey:       os.Getenv("JWT_SECRET"),
		ExpirationHours: 240,
	}

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowHeaders = append(corsConfig.AllowHeaders, "Authorization")

	router := gin.Default()

	router.Use(cors.New(corsConfig))
	router.Use(auth.AuthMiddleware(jwt))
	router.Use(GinContextToContextMiddleware())

	router.POST("/query", gqlHandler(db.New(client), jwt))
	router.GET("/", playgroundHandler())
	router.Run(":" + port)
}

func gqlHandler(db db.DB, jwt auth.JwtWrapper) gin.HandlerFunc {
	config := generated.Config{
		Resolvers: &resolver.Resolver{
			DB:        db,
			Validator: validator.New(),
			Jwt:       jwt,
		},
	}
	h := handler.NewDefaultServer(generated.NewExecutableSchema(config))

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

func playgroundHandler() gin.HandlerFunc {
	h := playground.Handler("GraphQL playground", "/query")

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

func GinContextToContextMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.WithValue(c.Request.Context(), "GinContextKey", c)
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

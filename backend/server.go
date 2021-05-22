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

type Config struct {
	Port        string
	DatabaseURI string
	JwtSecret   string
}

var cfg Config

func main() {
	_ = godotenv.Load()

	cfg = Config{
		Port:        getEnvOrDefault("PORT", "5000"),
		DatabaseURI: getEnvOrDefault("MONGODB_URI", "mongodb://localhost:27017"),
		JwtSecret:   os.Getenv("JWT_SECRET"),
	}
	if cfg.JwtSecret == "" {
		log.Fatal("JWT_SECRET env var not present or empty")
	}

	clientOptions := options.Client().ApplyURI(cfg.DatabaseURI)
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
		SecretKey:       cfg.JwtSecret,
		ExpirationHours: 240,
	}

	// Check that unique indexes are in place
	mongoService := db.New(client)
	if err := mongoService.EnsureIndexes(); err != nil {
		log.Fatal(err)
	}

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowHeaders = append(corsConfig.AllowHeaders, "Authorization")

	router := gin.Default()

	router.Use(cors.New(corsConfig))
	router.Use(auth.AuthMiddleware(jwt))
	router.Use(GinContextToContextMiddleware())

	router.POST("/query", gqlHandler(mongoService, jwt))
	router.GET("/", playgroundHandler())
	router.Run(":" + cfg.Port)
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

func getEnvOrDefault(envKey string, defaultStr string) string {
	if env, ok := os.LookupEnv(envKey); ok {
		return env
	}
	return defaultStr
}

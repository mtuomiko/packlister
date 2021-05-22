package main

import (
	"context"
	"log"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/joho/godotenv"

	"github.com/mtuomiko/packlister/auth"
	"github.com/mtuomiko/packlister/db"
	"github.com/mtuomiko/packlister/graphql/generated"
	"github.com/mtuomiko/packlister/graphql/resolver"
)

func main() {
	_ = godotenv.Load()

	cfg := GetConfig()
	log.Println("Running in " + cfg.Environment + " mode")

	router := setup(cfg)
	router.Run(":" + cfg.Port)

	defer db.DisconnectClient()
}

func setup(cfg Config) *gin.Engine {
	// Connect DB
	db.ConnectClient(cfg.DatabaseURI)

	// Check that unique indexes are in place
	mongoService := db.New()
	if err := mongoService.EnsureIndexes(); err != nil {
		log.Fatal(err)
	}

	jwt := auth.JwtWrapper{
		SecretKey:       cfg.JwtSecret,
		ExpirationHours: 240,
	}

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowHeaders = append(corsConfig.AllowHeaders, "Authorization")

	var router *gin.Engine
	switch cfg.Environment {
	case "production":
		gin.SetMode(gin.ReleaseMode)
		router = gin.New()
		router.Use(gin.Recovery())
	case "test":
		router = gin.New()
		router.Use(gin.Recovery())
	// assume development environment
	default:
		router = gin.Default()
	}

	router.Use(cors.New(corsConfig))
	router.Use(auth.AuthMiddleware(jwt))
	router.Use(GinContextToContextMiddleware())

	router.POST("/query", gqlHandler(mongoService, jwt))
	router.GET("/health", func(c *gin.Context) {
		c.String(200, "ok")
	})
	router.GET("/", playgroundHandler())

	return router
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

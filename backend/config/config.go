package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Environment string
	Port        string
	DatabaseURI string
	JwtSecret   string
}

func GetConfig() Config {
	_ = godotenv.Load()

	env := getEnvOrDefault("PACKLISTER_ENV", "development")

	var databaseURI string
	if env == "production" {
		databaseURI = os.Getenv("MONGODB_URI")
		if databaseURI == "" {
			log.Fatal("production MONGODB_URI env var not present or empty")
		}
	} else {
		databaseURI = "mongodb://localhost:27017"
	}

	cfg := Config{
		Environment: env,
		Port:        getEnvOrDefault("PORT", "5000"),
		DatabaseURI: databaseURI,
		JwtSecret:   os.Getenv("JWT_SECRET"),
	}

	if cfg.JwtSecret == "" {
		log.Fatal("JWT_SECRET env var not present or empty")
	}

	return cfg
}

func getEnvOrDefault(envKey string, defaultStr string) string {
	if env, ok := os.LookupEnv(envKey); ok {
		return env
	}
	return defaultStr
}

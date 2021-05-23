package main

import (
	"log"

	"github.com/joho/godotenv"

	"github.com/mtuomiko/packlister/application"
	"github.com/mtuomiko/packlister/config"
	"github.com/mtuomiko/packlister/db"
)

func main() {
	_ = godotenv.Load()
	cfg := config.GetConfig()

	log.Println("Running in " + cfg.Environment + " mode")

	err := db.ConnectClient(cfg.DatabaseURI)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err = db.DisconnectClient(); err != nil {
			log.Println(err)
		}
	}()

	router := application.Setup(cfg)
	router.Run(":" + cfg.Port)
}

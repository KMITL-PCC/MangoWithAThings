package main

import (
	"log"

	"mangoBackend/internal/handlers"
	"mangoBackend/internal/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"

	// "mangoBackend/internal/middleware"
	"mangoBackend/internal/database"
)

func main() {
	godotenv.Load()
    database.ConnectDB()

	app := fiber.New()

	// Public Routes
	app.Post("/api/login", middleware.GuestOnly(), handlers.Login)
	app.Post("/api/logout", handlers.Logout)
	app.Post("/api/seed", handlers.SeedMenus)
	// app.Post("api/city", handlers.SelectCity)
	
	userGroup := app.Group("/api", middleware.Protected())
	userGroup.Put("/api/updateLocation", handlers.SelectCity)

	log.Fatal(app.Listen(":8080"))
}
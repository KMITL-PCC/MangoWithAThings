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
	// app.Get("/api/health", func(c *fiber.Ctx) error {
	// 	return c.JSON(fiber.Map{"status": "ok"})
	// })

	// Protected Routes (ต้องมี Token จาก RADIUS login)
	// api := app.Group("/api", middleware.Protected())
    
	// api.Get("/menus", handlers.GetMenus)
	// api.Post("/menus/:id/vote", handlers.VoteMenu)

	log.Fatal(app.Listen(":8080"))
}
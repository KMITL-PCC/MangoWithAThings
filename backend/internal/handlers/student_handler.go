package handlers

import (
	"context"
	"mangoBackend/internal/database"
	"mangoBackend/internal/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func GetStudents(c *fiber.Ctx) error {
	//1. connect to DB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	studentCollection := database.GetCollection("students")

	//2. query all students
	cursor, err := studentCollection.Find(ctx, bson.M{})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}
	defer cursor.Close(ctx)

	var students []models.Student
	if err = cursor.All(ctx, &students); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error parsing students"})
	}

	return c.JSON(fiber.Map{
		"students": students,
	})
}
package handlers

import (
	"context"
	"mangoBackend/internal/database"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
)

type CityRequest struct {
	Location string `json:"location" validate:"required,min=2"`
}

func SelectCity(c *fiber.Ctx) error {

	// 1. get user name from token
	userToken := c.Locals("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)
	username := claims["username"].(string)

	//2. parse request body
	var req CityRequest
	if err :=c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	//3. connect to DB and update city
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	collection := database.GetCollection("users")

	filter := bson.M{"username": username}

	update := bson.M{
		"$set": bson.M{
			"location": req.Location,
		},
	}

	_, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Could not update city",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Hello " + username,
		"city": req.Location,
	})
}
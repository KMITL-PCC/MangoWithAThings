package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type CityRequest struct {
	Location string `json:"location" validate:"required,min=2"`
}

func SelectCity(c *fiber.Ctx) error {
	userToken := c.Locals("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)
	username := claims["username"].(string)

	return c.JSON(fiber.Map{
		"message": "Hello " + username + ", you select city!",
	})
}
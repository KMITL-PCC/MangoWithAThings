package handlers

import (
	"context"
	"mangoBackend/internal/database"
	"mangoBackend/internal/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func VoteMenu(c *fiber.Ctx) error {
	//1. receive menu ID from URL params
	newMenuIDHex := c.Params("id")
	newMenuID, err := primitive.ObjectIDFromHex(newMenuIDHex)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid menu ID"})
	}

	//2. get user name from token
	userToken := c.Locals("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)
	voterName := claims["username"].(string)

	//3. connect to DB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	voteLogCol := database.GetCollection("vote_logs")
	menuCol := database.GetCollection("menus")

	filter := bson.M{"voter": voterName}

	update := bson.M{
		"$set": bson.M{
			"menu_id":   newMenuID,
			"created_at": time.Now(),
		},
	}

	opts := options.FindOneAndUpdate().SetUpsert(true).SetReturnDocument(options.Before)

	var oldVote models.VoteLog
	err = voteLogCol.FindOneAndUpdate(ctx, filter, update, opts).Decode(&oldVote)

	if err != nil {
		if err == mongo.ErrNoDocuments{
			menuCol.UpdateOne(ctx, bson.M{
				"_id": newMenuID,
			}, bson.M{
				"$inc": bson.M{"vote_count": 1},
			})

			return c.JSON(fiber.Map{"message": "Vote success"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	//4. adjust vote counts
	menuCol.UpdateOne(ctx, bson.M{"_id": oldVote.MenuID}, bson.M{"$inc": bson.M{"vote_count": -1}})

	menuCol.UpdateOne(ctx, bson.M{"_id": newMenuID}, bson.M{"$inc": bson.M{"vote_count": 1}})

	return c.JSON(fiber.Map{
		"message":      "Vote updated",
		"previous_menu": oldVote.MenuID,
		"current_menu":  newMenuID,
	})
}
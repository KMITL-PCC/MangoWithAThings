package handlers

import (
	"context"
	"mangoBackend/internal/auth"
	"mangoBackend/internal/database"
	"mangoBackend/internal/models"
	"mangoBackend/internal/utils"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// เพิ่ม Field Address ใน Request เผื่อUserส่งมาตอน Login ครั้งแรก
type LoginRequest struct {
	Username string `json:"username" validate:"required,min=4,max=20"`
	Password string `json:"pass" validate:"required,min=4"`
}

func Login(c *fiber.Ctx) error {
	// 1. Parse Body
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if errors := utils.ValidStruct(req); errors != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "Validation Failed",
			"errors": errors,
		})
	}
	
	// 2. ถาม FreeRADIUS
	if err := auth.AuthenticateWithRadius(req.Username, req.Password); err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid username or password"})
	}

	// ---------------------------------------------------------
	// 3. จัดการข้อมูลใน MongoDB (จุดที่เพิ่มเข้ามา)
	// ---------------------------------------------------------
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	userCollection := database.GetCollection("users")

	// เงื่อนไข: หา user ที่มี username นี้
	filter := bson.M{"username": req.Username}

	update := bson.M{
        "$set": bson.M{
            "last_login": time.Now(),
        },
        "$setOnInsert": bson.M{
            "created_at": time.Now(),
            "role":       "user",
            "location":   "", // (Optional) จะกำหนดค่าเริ่มต้นให้ Location เป็นว่างก็ได้
        },
    }

	opts := options.FindOneAndUpdate().
        SetUpsert(true).                  // หาไม่เจอให้สร้าง
        SetReturnDocument(options.After)  // *** สำคัญ: ขอข้อมูล "หลัง" อัปเดตเสร็จแล้ว (New Version)

	var user models.User

	err := userCollection.FindOneAndUpdate(ctx, filter, update, opts).Decode(&user)
    
	if err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Database error"})
    }
	// ---------------------------------------------------------

	// 4. Generate JWT
	token, err := auth.GenerateToken(req.Username)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not generate token"})
	}

	cookie := new(fiber.Cookie)
	cookie.Name = "jwt"
	cookie.Value = token
	cookie.Expires = time.Now().Add(24 * time.Hour)
	cookie.HTTPOnly = true
	cookie.SameSite = "Lax"

	c.Cookie(cookie)

	return c.JSON(fiber.Map{
		"message": "Login successful",
		"username": req.Username,
		"location": user.Location,
	})
}

func Logout(c *fiber.Ctx) error {
	cookie := new(fiber.Cookie)
	cookie.Name = "jwt"
	cookie.Value = ""
	cookie.Expires = time.Now().Add(-time.Hour)
	cookie.HTTPOnly = true

	c.Cookie(cookie)

	return c.JSON(fiber.Map{
		"message": "Logout successful",
	})
}
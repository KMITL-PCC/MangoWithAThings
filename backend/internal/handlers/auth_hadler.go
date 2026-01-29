package handlers

import (
	"mangoBackend/internal/auth"

	"github.com/gofiber/fiber/v2"
)

// เพิ่ม Field Address ใน Request เผื่อUserส่งมาตอน Login ครั้งแรก
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c *fiber.Ctx) error {
	// 1. Parse Body
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	// 2. ถาม FreeRADIUS
	if err := auth.AuthenticateWithRadius(req.Username, req.Password); err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid username or password"})
	}

	// ---------------------------------------------------------
	// 3. จัดการข้อมูลใน MongoDB (จุดที่เพิ่มเข้ามา)
	// ---------------------------------------------------------
	// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	// defer cancel()
	// userCollection := database.GetCollection("users")

	// // เงื่อนไข: หา user ที่มี username นี้
	// filter := bson.M{"username": req.Username}

	// // สิ่งที่จะทำ:
	// // - $set: อัปเดตข้อมูล (last_login) และ address (ถ้าส่งมา)
	// // - $setOnInsert: ถ้าเป็นการสร้างใหม่ ให้ใส่วันที่ created_at และ role
	// update := bson.M{
	// 	"$set": bson.M{
	// 		"last_login": time.Now(),
	// 	},
	// 	"$setOnInsert": bson.M{
	// 		"created_at": time.Now(),
	// 		"role":       "user",
	// 	},
	// }

	// // ถ้า User ส่ง Address มาด้วย ให้อัปเดต Address ลงไป
	// // if req.Address != "" {
	// // 	update["$set"].(bson.M)["address"] = req.Address
	// // }

	// // Option: Upsert = true (หาไม่เจอ ให้สร้างใหม่เลย!)
	// opts := options.Update().SetUpsert(true)

	// _, err := userCollection.UpdateOne(ctx, filter, update, opts)
	// if err != nil {
	// 	// Login ผ่าน Radius แล้ว แต่เซฟลง DB ไม่ได้ (อาจจะ DB ล่ม)
	// 	// เราควรยอมให้เขา Login ไหม? ขึ้นอยู่กับ Business
	// 	// แต่เคสนี้ return error ไปก่อนเพื่อความปลอดภัย
	// 	return c.Status(500).JSON(fiber.Map{"error": "Failed to update user profile"})
	// }

	// ---------------------------------------------------------

	// 4. Generate JWT
	token, err := auth.GenerateToken(req.Username)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not generate token"})
	}

	return c.JSON(fiber.Map{
		"message": "Login successful",
		"token":   token,
		"first_time_hint": "Check if address is empty in profile", // บอก Frontend อ้อมๆ
	})
}
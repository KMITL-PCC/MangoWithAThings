package middleware

import (
	"os"

	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
)

// Protected: ตรวจสอบว่ามี Token ถูกต้องไหม (ถ้าไม่มี ห้ามผ่าน)
func Protected() fiber.Handler {
	return jwtware.New(jwtware.Config{
		// 1. กุญแจสำหรับตรวจสอบลายเซ็น (ต้องตรงกับตอน Login)
		SigningKey: jwtware.SigningKey{Key: []byte(os.Getenv("JWT_SECRET"))},

		// 2. บอกให้ไปหา Token ใน Cookie ที่ชื่อว่า "jwt" 
		// (ถ้าไม่ใส่บรรทัดนี้ มันจะไปหาใน Header: Authorization แทน)
		TokenLookup: "cookie:jwt",

		// 3. จัดการ Error (ถ้า Token ไม่มี, หมดอายุ, หรือปลอม)
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized", 
				"message": "Please login first",
			})
		},
		
		// 4. (Optional) เก็บข้อมูลไว้ใน c.Locals ชื่ออะไร (Default คือ "user")
		ContextKey: "user", 
	})
}
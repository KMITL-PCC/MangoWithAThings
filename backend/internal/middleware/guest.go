package middleware

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// GuestOnly: ยอมให้ผ่านเฉพาะคนที่ "ยังไม่ได้ Login" เท่านั้น
func GuestOnly() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// 1. ลองดึง Cookie ออกมา
		cookie := c.Cookies("jwt")
		
		// 2. ถ้าไม่มี Cookie เลย -> ผ่าน (ไป Login ได้)
		if cookie == "" {
			return c.Next()
		}

		// 3. ถ้ามี Cookie ต้องเช็คว่ามัน Valid ไหม? (เผื่อเป็น Cookie ขยะ)
		token, err := jwt.Parse(cookie, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		// 4. ถ้า Token Valid แปลว่า "Login อยู่แล้ว" -> ห้ามไปต่อ!
		if err == nil && token.Valid {
			return c.Status(403).JSON(fiber.Map{
				"error": "You are already logged in",
				"redirect": "/menus", // บอก Frontend ว่าควรเด้งไปไหน
			})
		}

		// 5. ถ้ามี Cookie แต่ Token หมดอายุหรือพัง -> ถือว่ายังไม่ Login -> ผ่าน
		return c.Next()
	}
}
package handlers

import (
	"context"
	"mangoBackend/internal/database"
	"mangoBackend/internal/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func SeedMenus(c *fiber.Ctx) error {
    // ข้อมูลเริ่มต้น (Mock Data)
    menus := []interface{}{
        models.Menu{Name: "น้ำปลาหวาน", VoteCount: 0},
        models.Menu{Name: "พริกเกลือ", VoteCount: 0},
        models.Menu{Name: "พริกเกลือลาว", VoteCount: 0},
        models.Menu{Name: "กะปิ", VoteCount: 0},
        models.Menu{Name: "บ๊วย", VoteCount: 0},
        models.Menu{Name: "มันกุ้ง", VoteCount: 0},
    }

	students := []models.Student{
		{Name: "สมชาย ใจดี", StudentID: "6201012610050", Major: "Computer engineering", CreatedAt: time.Now()},
		{Name: "สมหญิง แสนสวย", StudentID: "6201012610051", Major: "Computer engineering", CreatedAt: time.Now()},
		{Name: "สมปอง รวยรินทร์", StudentID: "6201012610052", Major: "Computer engineering", CreatedAt: time.Now()},
	}

	var studentsWithField []interface{}
    for _, student := range students {
        studentsWithField = append(studentsWithField, student)
    }

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    
    collection := database.GetCollection("menus")
    
	_, err := collection.DeleteMany(ctx, bson.M{}) 
    if err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Failed to clear old menus"})
    }

    // Insert Many ทีเดียวหลายตัว
    _, err = collection.InsertMany(ctx, menus)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Seeding failed"})
    }

	studentCollection := database.GetCollection("students")
	_, err = studentCollection.DeleteMany(ctx, bson.M{})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to clear old students"})
	}

	_, err = studentCollection.InsertMany(ctx, studentsWithField)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Seeding students failed"})
	}

    return c.JSON(fiber.Map{
        "message": "Database cleared and seeded successfully!",
        "count":   len(menus),
    })
}
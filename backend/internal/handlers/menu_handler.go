package handlers

import (
	"context"
	"mangoBackend/internal/database"
	"mangoBackend/internal/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
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
		{Name: "ธนะวัฒน์ บุญประสพ", StudentID: "66200105", Major: "Computer engineering", CreatedAt: time.Now()},
		{Name: "ธนายุทธ ศรีเรือง", StudentID: "66200108", Major: "Computer engineering", CreatedAt: time.Now()},
		{Name: "ภัทรดนัย บุญไทย", StudentID: "66200383", Major: "Computer engineering", CreatedAt: time.Now()},
	}

	var studentsWithField []interface{}
    for _, student := range students {
        studentsWithField = append(studentsWithField, student)
    }

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    
    menuCollection := database.GetCollection("menus")
        
	_, err := menuCollection.DeleteMany(ctx, bson.M{}) 
    if err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Failed to clear old menus"})
    }

    // Insert Many ทีเดียวหลายตัว
    _, err = menuCollection.InsertMany(ctx, menus)
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

func GetMenus(c *fiber.Ctx) error {
    //1. connect to DB
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    menuCollection := database.GetCollection("menus")
    voteLogCollection := database.GetCollection("vote_logs")

    //2. query all menus
    cursor, err := menuCollection.Find(ctx, bson.M{})
    if err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Database error"})
    }
    defer cursor.Close(ctx)

    var menus []models.Menu
    if err = cursor.All(ctx, &menus); err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Error parsing menus"})
    }

    //3. query vote log for this user
    var myVotedMenuID string = ""

    userToken := c.Locals("user").(*jwt.Token)
    claims := userToken.Claims.(jwt.MapClaims)
    username := claims["username"].(string)

    var voteLog models.VoteLog
    err = voteLogCollection.FindOne(ctx, bson.M{"voter": username}).Decode(&voteLog)

    if err == nil {
        myVotedMenuID = voteLog.MenuID.Hex()
    }

    return c.JSON(fiber.Map{
        "menus": menus,
        "username": username,
        "vote_id": myVotedMenuID,
    })
}
package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	
	// Username ต้อง Unique (ห้ามซ้ำ) เอาไว้เชื่อมกับ RADIUS
	Username  string             `bson:"username" json:"username"`
	
	// Address เก็บที่อยู่ (อาจจะว่างได้ถ้าเขายังไม่กรอก)
	Address   string             `bson:"address" json:"address"`
	
	Role      string             `bson:"role" json:"role"` // user, admin
	
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	LastLogin time.Time          `bson:"last_login" json:"last_login"`
}
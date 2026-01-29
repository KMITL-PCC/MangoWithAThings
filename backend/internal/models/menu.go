package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Menu Model: ตัวแทนของลิ้นชัก 'menus'
type Menu struct {
	// ID: เปรียบเสมือน Primary Key
	// bson:"_id,omitempty" แปลว่า: ในฐานข้อมูลชื่อ field "_id" นะ ถ้าตอนสร้างไม่มีค่า ให้ Mongo สร้างให้หน่อย
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	
	Name        string             `bson:"name" json:"name"`
	ImageURL    string             `bson:"image_url" json:"image_url"`
	
	// VoteCount: เราเก็บยอดรวมไว้ที่นี่เลย เพื่อความเร็วเวลาดึงมาแสดงหน้าเว็บ
	VoteCount   int                `bson:"vote_count" json:"vote_count"`
}

// VoteLog Model: ตัวแทนของลิ้นชัก 'votes' (เอาไว้ตรวจสอบ)
type VoteLog struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	
	// MenuID: เก็บ ID ของเมนูที่ถูกโหวต (Foreign Key แบบ NoSQL)
	MenuID    primitive.ObjectID `bson:"menu_id" json:"menu_id"`
	
	// Voter: เก็บ Username ที่ได้จาก RADIUS Login
	Voter     string             `bson:"voter" json:"voter"`
	
	// CreatedAt: เก็บเวลาที่โหวต
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}
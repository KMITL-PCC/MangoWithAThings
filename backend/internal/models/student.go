package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Student struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name      string             `bson:"name" json:"name"`
	StudentID string             `bson:"student_id" json:"student_id"`
	Major	 string             `bson:"major" json:"major"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}
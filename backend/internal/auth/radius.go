package auth

import (
	"context"
	"errors"
	"fmt"
	"os"
	"time"

	"layeh.com/radius"
	"layeh.com/radius/rfc2865"
)

// AuthenticateWithRadius ส่ง User/Pass ไปเช็คกับ FreeRADIUS Server
func AuthenticateWithRadius(username, password string) error {
	serverAddr := os.Getenv("RADIUS_SERVER_ADDR") // ex: "192.168.1.50:1812"
	secret := []byte(os.Getenv("RADIUS_SECRET"))  // Shared Secret
	fmt.Println("RADIUS_SERVER_ADDR:", serverAddr)
	fmt.Println("RADIUS_SECRET:", string(secret))

	// 1. สร้าง Packet Access-Request
	packet := radius.New(radius.CodeAccessRequest, secret)
	rfc2865.UserName_SetString(packet, username)
	rfc2865.UserPassword_SetString(packet, password)
	fmt.Println("Password :", password)

	// 2. ส่ง Request (กำหนด Timeout 5 วินาที)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	response, err := radius.Exchange(ctx, packet, serverAddr)
	if err != nil {
		return err // Connection error
	}

	// 3. เช็ค Response Code
	if response.Code == radius.CodeAccessAccept {
		return nil // Login ผ่าน
	}

	return errors.New("authentication failed: access denied")
}
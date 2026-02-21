package utils

import (
	"backend/models"

	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) []byte{
	hashed, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return hashed
}

func VerifyPassword(existing models.LoginRequest, creds models.AccountCreds) bool{
	return bcrypt.CompareHashAndPassword([]byte(existing.Password), []byte(creds.Password)) == nil
}
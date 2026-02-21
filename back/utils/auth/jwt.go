package utils

import (
	"backend/models"
	"backend/utils"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJWT(username string, role string) (string, error){
	claims := jwt.MapClaims{
	"username": username,
	"role": role,
	"exp": time.Now().Add(time.Hour).Unix(),
	"iat": time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(utils.GetJWTSecret())
}

func VerifyJWT(tokenString string) (models.LoginResponse, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any,error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return utils.GetJWTSecret(), nil
	})

	if err != nil {
		return models.LoginResponse{}, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		username, _ := claims["username"].(string)
		role, _ := claims["role"].(string)
		response := models.LoginResponse{Username: username, Role: role}
		return response, nil
	}
	return models.LoginResponse{}, fmt.Errorf("invalid token")
}
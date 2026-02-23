package utils

import (
	"backend/models"
	"backend/utils"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJWT(email string, role string, id int) (string, error){
	claims := jwt.MapClaims{
	"id_account": id,
	"email": email,
	"role": role,
	"exp": time.Now().Add(time.Hour).Unix(),
	"iat": time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(utils.GetJWTSecret())
}

func ParseJWT(tokenString string) (models.AuthClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any,error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return utils.GetJWTSecret(), nil
	})

	if err != nil {
		return models.AuthClaims{}, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		idFloat,_ := claims["id_account"].(float64)
		idAccount := int(idFloat)
		email, _ := claims["email"].(string)
		role, _ := claims["role"].(string)

		return models.AuthClaims{
			Id:    idAccount,
			Email: email,
			Role:  role,
		}, nil
	}
	return models.AuthClaims{}, fmt.Errorf("invalid token")
}
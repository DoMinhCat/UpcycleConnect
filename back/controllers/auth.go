package controllers

import (
	"backend/db"
	"backend/models"
	utils "backend/utils/auth"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
)

func Login(w http.ResponseWriter, r *http.Request) { 
	var creds models.LoginRequest 
	err := json.NewDecoder(r.Body).Decode(&creds) 

	if err != nil { 
		http.Error(w, "invalid JSON request body", http.StatusBadRequest)
		slog.Debug("invalid JSON request body", "error", err)
		return 
	} 

	existing, err := db.GetAccountCredsByUsername(creds.Username) 
	if err != nil { 
		http.Error(w, fmt.Sprintf("error requesting user by username: %v", err), 
		http.StatusInternalServerError) 
		return 
	}

	if existing == nil || creds.Username != existing.Username || 
		creds.Password != existing.Password { 
		http.Error(w, "unauthorized", http.StatusUnauthorized) 
		return 
	}

	token, err := utils.GenerateJWT(creds.Username, existing.Role)
	if err != nil { 
		http.Error(w, "token generation failed", 
		http.StatusInternalServerError) 
		return 
	} 

	json.NewEncoder(w).Encode(map[string]string{"token": token})
}
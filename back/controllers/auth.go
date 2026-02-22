package controllers

import (
	"backend/db"
	"backend/models"
	utils "backend/utils/auth"
	"encoding/json"
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

	existing, err := db.GetAccountCredsByEmail(creds.Email) 
	if err != nil { 
		http.Error(w, "login failed",http.StatusInternalServerError) 
		slog.Error("GetAccountCredsByEmail() failed", "controller", "Login", "error", err)
		return 
	}

	if existing == nil || creds.Email != existing.Email || !utils.IsPasswordCorrect(existing.Password, creds.Password){ 
		http.Error(w, "unauthorized", http.StatusUnauthorized) 
		return 
	}

	// check if is admin
	if existing.Role=="employee"{
		isAdmin, err := db.GetEmployeeRoleById(existing.Id)
		if err != nil { 
			http.Error(w, "login failed",http.StatusInternalServerError) 
			slog.Error("GetEmployeeRoleById() failed", "controller", "Login", "error", err)
		return 
		}
		if isAdmin {
			existing.Role = "admin"
		} else {
			existing.Role = "employee"
		}
	}

	token, err := utils.GenerateJWT(creds.Email, existing.Role, existing.Id)
	if err != nil { 
		http.Error(w, "token generation failed", 
		http.StatusInternalServerError) 
		return 
	} 

	json.NewEncoder(w).Encode(map[string]string{"token": token})
}
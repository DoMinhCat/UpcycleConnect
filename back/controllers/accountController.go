package controllers

import (
	"backend/db"
	"backend/models"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"regexp"
)

func CreateAccount(w http.ResponseWriter, r *http.Request) {
	var newAccount models.CreateAccountRequest

	var err = json.NewDecoder(r.Body).Decode(&newAccount)
	if err != nil{
		http.Error(w, "invalid JSON request body", http.StatusBadRequest)
		slog.Debug("invalid JSON request body", "error", err)
		return
	}

	// validate
	var errMsg []string
	if len(newAccount.Username) < 4 || len(newAccount.Username) > 50{
		errMsg = append(errMsg,"username must be between 4 and 50 characters")
	}

	if len(newAccount.Password) < 12 || len(newAccount.Password) > 120{
		errMsg = append(errMsg,"password must be between 12 and 120 characters")
	}

	emailRegex := `^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`
	emailMatch, _ := regexp.MatchString(emailRegex, newAccount.Email)
	if !emailMatch {
		errMsg = append(errMsg, "invalid email format")
	}

	passwordMatch, _ := regexp.Match("[A-Z]",[]byte(newAccount.Password))
	if !passwordMatch{
		errMsg = append(errMsg,"password must contain at least one capital character")
	}
	passwordMatch, _ = regexp.Match("[0-9]",[]byte(newAccount.Password))
	if !passwordMatch{
		errMsg = append(errMsg,"password must contain at least one digit")
	}
	passwordMatch, _ = regexp.Match("\\W",[]byte(newAccount.Password))
	if !passwordMatch{
		errMsg = append(errMsg,"password must contain at least one special character")
	}

	if (newAccount.Role != "user" && newAccount.Role != "pro" && newAccount.Role != "employee"){
		errMsg = append(errMsg, "role must be 'user', 'pro', or 'employee'")
	} 

	if len(errMsg) > 0{
		encodedErr, _ := json.Marshal(errMsg)
		http.Error(w, string(encodedErr), http.StatusBadRequest)
		return
	}

	// Check for existed username
	usernameExists, err := db.CheckUsernameExists(newAccount.Username)
	if err != nil{
		http.Error(w, "account creation failed", http.StatusInternalServerError)
		return
	}
	if usernameExists{
		http.Error(w, fmt.Sprintf("'%s' has been taken, please choose another username", newAccount.Username), http.StatusConflict)
		return
	}
	// Check for existed email
	emailExists, err := db.CheckEmailExists(newAccount.Email)
	if err != nil{
		http.Error(w, "account creation failed", http.StatusInternalServerError)
		return
	}
	if emailExists{
		http.Error(w, "an account has been already registered with this email", http.StatusConflict)
		return
	}

	err = db.CreateAccount(newAccount)
	if err != nil{
		http.Error(w, "account creation failed", http.StatusInternalServerError)
		slog.Debug("CreateAccount() failed", "error", err)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
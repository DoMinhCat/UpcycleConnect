package routes

import (
	"backend/controllers"
	"net/http"
)

func GetAccountRoutes(mux *http.ServeMux) {
	// Create new account
	mux.HandleFunc("POST /account/{$}", controllers.CreateAccount)
}
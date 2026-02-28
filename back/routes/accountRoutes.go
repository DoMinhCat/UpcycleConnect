package routes

import (
	"backend/controllers"
	"backend/middleware"
	"net/http"
)

// TODO: wrap all with auth middleware so that UpdateLastActive knows which id to update
func GetAccountRoutes(mux *http.ServeMux) {
	// Create new account, this one handles the creation of an account for a user, pro or employee
	mux.Handle("POST /register/{$}", middleware.UpdateLastActive(http.HandlerFunc(controllers.CreateAccount)))
	// Get all accounts, this one handles the retrieval of all accounts
	mux.Handle("GET /accounts/{$}", middleware.UpdateLastActive(http.HandlerFunc(controllers.GetAllAccounts)))
	// Soft delete an account, this one handles the soft deletion of an account
	mux.Handle("DELETE /accounts/{id_account}/{$}", middleware.UpdateLastActive(http.HandlerFunc(controllers.SoftDeleteAccount)))
}

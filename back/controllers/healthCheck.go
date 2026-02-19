package controllers

import (
	"backend/utils"
	"fmt"
	"net/http"
)

func HealthCheck(w http.ResponseWriter, r *http.Request) {
	err := utils.Conn.Ping()
	if err != nil {
		fmt.Fprintf(w, "Error connecting to database: %v", err)
	} else{
		var result = "Database connected successfully"
		fmt.Fprintf(w, "%s", result)
	}
}
package controller

import (
	"backend/db"
	"fmt"
	"net/http"
)

func HealthCheck(res http.ResponseWriter, req *http.Request) {
	err := db.Conn.Ping()
	if err != nil {
		fmt.Fprintf(res, "Error connecting to database: %v", err)
	} else{
		var result = "Database connected."
		fmt.Fprintf(res, "%s", result)
	}
}
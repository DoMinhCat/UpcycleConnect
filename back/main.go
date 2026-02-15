package main

import (
	"backend/controller"
	"backend/db"
	"fmt"
	"net/http"
)

func main(){
	db.Conn, db.ErrDb = db.GetDb()
	defer db.Conn.Close()

	http.HandleFunc("GET /healthcheck/{$}", controller.HealthCheck)

	fmt.Println("Listening at : http://localhost:8080/")
	http.ListenAndServe(":8080", nil)
}

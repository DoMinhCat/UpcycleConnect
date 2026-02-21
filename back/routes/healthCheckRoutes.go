package routes

import (
	"backend/controllers"
	"net/http"
)

func GetHealthCheckRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /healthcheck/{$}", controllers.HealthCheck)
}


// others to add


// func GetProRoute(mux *http.ServeMux) {

// }

// func GetEmployeeRoute(mux *http.ServeMux) {

// }

// func GetAdminRoute(mux *http.ServeMux) {

// }

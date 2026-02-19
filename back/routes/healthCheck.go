package routes

import (
	"backend/controllers"
	"net/http"
)

func GetHealthCheckRoute(mux *http.ServeMux) {
	mux.HandleFunc("/", controllers.HealthCheck)
}

func GetUserRoute(mux *http.ServeMux) {

}

func GetProRoute(mux *http.ServeMux) {

}

func GetEmployeeRoute(mux *http.ServeMux) {

}

func GetAdminRoute(mux *http.ServeMux) {

}

package routes

import (
	"backend/controller"
	"net/http"
)

func GetHealthCheckRoute(mux *http.ServeMux) {
	mux.HandleFunc("/", controller.HealthCheck)
}

func GetUserRoute(mux *http.ServeMux) {

}

func GetProRoute(mux *http.ServeMux) {

}

func GetEmployeeRoute(mux *http.ServeMux) {

}

func GetAdminRoute(mux *http.ServeMux) {

}

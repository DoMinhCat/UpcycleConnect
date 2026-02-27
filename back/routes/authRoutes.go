package routes

import (
	"backend/controllers"
	"net/http"
)

func GetAuthRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /login/{$}", controllers.Login)
}

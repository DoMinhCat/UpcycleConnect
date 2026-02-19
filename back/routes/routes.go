package routes

import (
	"net/http"
)

func GetAllRoutes() *http.ServeMux {
	mux := http.NewServeMux()

	GetHealthCheckRoute(mux)
	// add more routes later

	return mux
}
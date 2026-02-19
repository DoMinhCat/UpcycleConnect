package main

import (
	"backend/routes"
	"backend/utils"
	"net/http"
)

func main(){
	utils.LoadEnv()
	utils.Conn, utils.ErrDb = utils.GetDb()
	defer utils.Conn.Close()

	mux := routes.GetAllRoutes()

	port := utils.GetPort()
	http.ListenAndServe(":" + port, mux)
}

package main

import (
	"backend/routes"
	"backend/utils"
	"log/slog"
	"net/http"
)

func main(){
	utils.InitLogger()

	utils.LoadEnv()
	utils.Conn, utils.ErrDb = utils.GetDb()
	if utils.ErrDb != nil{
		slog.Error("failed to connect to database", "error", utils.ErrDb)
	}else{
		slog.Info("connected to database successfully")
	}
	defer utils.Conn.Close()


	mux := routes.GetAllRoutes()

	port := utils.GetPort()
	slog.Info("backend started", "port", port)
	http.ListenAndServe(":" + port, mux)
}

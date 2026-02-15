package db

// Connection to DB

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

var Conn *sql.DB
var ErrDb error

// TODO: fetch from .env when deployed to server
const(
	driver = "postgres"
	host = "localhost"
	port = 5432
	user = "postgres"
	password = "minhcat05"
	dbname = "esgi2_golang_api_basic"
	sslmode = "disable" // switch to enable when db is hosted on server
)

func GetDb() (*sql.DB, error){
	var connString = fmt.Sprintf("host=%s port=%d dbname=%s user=%s password=%s sslmode=%s", host, port, dbname, user, password, sslmode)

	conn, err := sql.Open(driver, connString)
	if err != nil {
		return nil, fmt.Errorf("connecting to database failed: %v",err)
	}

	return conn, nil
}
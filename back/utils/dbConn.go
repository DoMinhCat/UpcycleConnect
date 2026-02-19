package utils

// Establish connection to DB

import (
	"database/sql"

	_ "github.com/lib/pq"
)

var Conn *sql.DB
var ErrDb error

func GetDb() (*sql.DB, error){
	var connString = GetDbUrl()
	var driver = GetDbDriver()
	conn, err := sql.Open(driver, connString)
	if err != nil {
		return nil, err
	}

	return conn, nil
}
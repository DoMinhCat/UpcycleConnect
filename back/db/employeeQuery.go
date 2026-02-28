package db

import (
	"backend/utils"
	"database/sql"
	"fmt"
)

// ALL QUERIES TO TABLE 'employees'

func GetEmployeeRoleById(id int) (bool, error) {
	var isAdmin bool
	row := utils.Conn.QueryRow("SELECT is_admin FROM employees WHERE id_account=$1", id)
	err := row.Scan(&isAdmin)
	if err != nil {
		return false, fmt.Errorf("error getting employee's role by id_account from DB: %v", err.Error())
	}

	return isAdmin, nil
}

func CheckIsAdmin(id int) (bool, error) {
	var isAdmin bool
	err := utils.Conn.QueryRow("SELECT is_admin FROM employees WHERE id_account=$1", id).Scan(&isAdmin)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil // Return nothing found without an error
		}
		return false, fmt.Errorf("CheckIsAdmin() failed: %v", err.Error())
	}
	return isAdmin, nil
}

func CreateEmployee(insertedId int, isAdmin bool) error {
	_, err := utils.Conn.Exec("INSERT INTO employees(id_account, is_admin) VALUES ($1, $2);", insertedId, isAdmin)
	if err != nil {
		err = DeleteAccount(insertedId)
		if err != nil {
			return fmt.Errorf("error rolling back after failed insertion into 'employees': %w", err)
		}
		return fmt.Errorf("CreateEmployee() failed: %v", err)
	}
	return nil
}

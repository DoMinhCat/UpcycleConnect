package db

import (
	"backend/utils"
	"fmt"
)

// ALL QUERIES TO TABLE 'employees'
func GetEmployeeRoleById(id int) (bool, error){
	var isAdmin bool
	row := utils.Conn.QueryRow("SELECT is_admin FROM employees WHERE id_account=$1", id)
	err := row.Scan(&isAdmin)
	if err!=nil{
		return false, fmt.Errorf("error getting employee's role by id_account from DB: %v", err.Error())
	}

	return isAdmin, nil
}
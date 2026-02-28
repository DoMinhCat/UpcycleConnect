package db

import (
	"backend/models"
	"backend/utils"
	"fmt"
)

func CreatePro(newAccount models.CreateAccountRequest, insertedId int) error {
	var err error
	if newAccount.Phone != "" {
		_, err = utils.Conn.Exec("INSERT INTO pros(id_account, phone) VALUES ($1, $2);", insertedId, newAccount.Phone)
	} else {
		_, err = utils.Conn.Exec("INSERT INTO pros(id_account) VALUES ($1);", insertedId)
	}
	if err != nil {
		err = DeleteAccount(insertedId)
		if err != nil {
			return fmt.Errorf("error rolling back after failed insertion into 'pros': %w", err)
		}
		return fmt.Errorf("CreatePro() failed: %w", err)
	}
	return nil
}
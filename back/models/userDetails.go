package models

import "github.com/guregu/null"

type UserDetails struct {
	Phone null.String `json:"phone"`
	Score int         `json:"score"`
}

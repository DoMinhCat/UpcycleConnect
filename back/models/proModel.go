package models

import "github.com/guregu/null"

type ProDetails struct {
	Phone     null.String `json:"phone"`
	IsPremium bool        `json:"is_premium"`
}
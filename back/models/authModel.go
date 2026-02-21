package models

type LoginResponse struct {
	Username string `json:"username"`
	Role     string `json:"role"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type AccountCreds struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role"`
}
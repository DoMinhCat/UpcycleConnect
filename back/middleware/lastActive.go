package middleware

import (
	"backend/models"
	"backend/utils"
	authUtils "backend/utils/auth"
	"context"
	"log/slog"
	"net/http"
	"strings"
	"time"
)

func UpdateLastActive(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user, ok := r.Context().Value("user").(models.AuthClaims)

		// If not in context (e.g. guest routes), manually parse token
		if !ok {
			authHeader := r.Header.Get("Authorization")
			if authHeader != "" {
				tokenString := strings.TrimPrefix(authHeader, "Bearer ")
				claims, err := authUtils.ParseJWT(tokenString)
				if err == nil {
					user = claims
					ok = true
					// Inject user into context for subsequent controllers even if it's a guest route
					r = r.WithContext(context.WithValue(r.Context(), "user", claims))
				}
			}
		}

		if !ok {
			next.ServeHTTP(w, r)
			return
		}
		accountID := user.Id

		_, err := utils.Conn.Exec("UPDATE accounts SET last_active = $1 WHERE id = $2 AND (last_active < $3 OR last_active IS NULL)", time.Now(), accountID, time.Now().Add(-2*time.Minute))
		if err != nil {
			slog.Error("UpdateLastActive() failed", "account_id", accountID, "error", err)
		}

		next.ServeHTTP(w, r)
	})
}

package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sudutkode/atur-perjalanan/backend/internal/platform/jwtutil"
)

// AuthRequired validates the Bearer JWT in the Authorization header.
// On success, sets "userID" (string UUID) into the Gin context for downstream handlers.
// On failure, aborts with 401 and a structured error body.
func AuthRequired(jwtSecret []byte) gin.HandlerFunc {
	return func(c *gin.Context) {
		raw := c.GetHeader("Authorization")
		token := extractBearer(raw)
		if token == "" {
			c.AbortWithStatusJSON(401, authError("MISSING_TOKEN", "authorization token is required"))
			return
		}

		userID, err := jwtutil.Verify(token, jwtSecret)
		if err != nil {
			c.AbortWithStatusJSON(401, authError("INVALID_TOKEN", "authorization token is invalid or expired"))
			return
		}

		c.Set("userID", userID.String())
		c.Next()
	}
}

// OptionalAuth parses the Bearer JWT in the Authorization header if present.
// Unlike AuthRequired it does NOT abort when no token is supplied — it simply
// skips setting "userID" so downstream handlers can treat the request as
// unauthenticated.
func OptionalAuth(jwtSecret []byte) gin.HandlerFunc {
	return func(c *gin.Context) {
		raw := c.GetHeader("Authorization")
		token := extractBearer(raw)
		if token == "" {
			c.Next()
			return
		}
		userID, err := jwtutil.Verify(token, jwtSecret)
		if err == nil {
			c.Set("userID", userID.String())
		}
		c.Next()
	}
}

func extractBearer(header string) string {
	const prefix = "Bearer "
	if !strings.HasPrefix(header, prefix) {
		return ""
	}
	return strings.TrimPrefix(header, prefix)
}

func authError(code, message string) any {
	return map[string]any{
		"error": map[string]string{
			"code":    code,
			"message": message,
		},
	}
}

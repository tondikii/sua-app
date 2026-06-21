package handler

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

// ── Error helpers ─────────────────────────────────────────────────────────────

type errorEnvelope struct {
	Error errorDetail `json:"error"`
}

type errorDetail struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func jsonError(c *gin.Context, status int, code, message string) {
	c.JSON(status, errorEnvelope{Error: errorDetail{Code: code, Message: message}})
}

func badRequest(c *gin.Context, code, message string) {
	jsonError(c, http.StatusBadRequest, code, message)
}

func unauthorized(c *gin.Context, code, message string) {
	jsonError(c, http.StatusUnauthorized, code, message)
}

func notFound(c *gin.Context, code, message string) {
	jsonError(c, http.StatusNotFound, code, message)
}

func conflict(c *gin.Context, code, message string) {
	jsonError(c, http.StatusConflict, code, message)
}

func internalError(c *gin.Context, err error) {
	slog.Error("unhandled internal error",
		"error", err,
		"path", c.FullPath(),
		"requestID", c.GetString("requestID"),
	)
	jsonError(c, http.StatusInternalServerError, "INTERNAL_ERROR", "an unexpected error occurred")
}

// ── Context helpers ───────────────────────────────────────────────────────────

// mustGetUserID retrieves the authenticated user ID injected by AuthRequired middleware.
// Only call this from routes that are always behind the AuthRequired middleware.
func mustGetUserID(c *gin.Context) uuid.UUID {
	raw, _ := c.Get("userID")
	id, _ := uuid.Parse(raw.(string))
	return id
}

// ── DTOs ──────────────────────────────────────────────────────────────────────

// userDTO is the public JSON representation of a user.
// Email is only populated for the authenticated user's own profile endpoints.
type userDTO struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	AvatarURL *string   `json:"avatar_url"`
	Bio       *string   `json:"bio"`
	IsPublic  bool      `json:"is_public"`
	CreatedAt time.Time `json:"created_at"`
}

func toUserDTO(u *domain.User) userDTO {
	return userDTO{
		ID:        u.ID.String(),
		Username:  u.Username,
		Name:      u.Name,
		Email:     u.Email,
		AvatarURL: u.AvatarURL,
		Bio:       u.Bio,
		IsPublic:  u.IsPublic,
		CreatedAt: u.CreatedAt,
	}
}

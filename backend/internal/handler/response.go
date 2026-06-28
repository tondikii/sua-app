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

func forbidden(c *gin.Context, code, message string) {
	jsonError(c, http.StatusForbidden, code, message)
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

// profileViewDTO is the privacy-aware public profile returned by GET /v1/users/:username.
type profileViewDTO struct {
	ID             string  `json:"id"`
	Username       string  `json:"username"`
	Name           string  `json:"name"`
	AvatarURL      *string `json:"avatar_url"`
	Bio            *string `json:"bio"`
	IsPublic       bool    `json:"is_public"`
	FollowersCount int     `json:"followers_count"`
	FollowingCount int     `json:"following_count"`
	PublicTripCount int    `json:"public_trip_count"`
	IsFollowing    bool    `json:"is_following"`
	CanViewContent bool    `json:"can_view_content"`
}

func toProfileViewDTO(v *domain.ProfileView) profileViewDTO {
	return profileViewDTO{
		ID:             v.ID.String(),
		Username:       v.Username,
		Name:           v.Name,
		AvatarURL:      v.AvatarURL,
		Bio:            v.Bio,
		IsPublic:       v.IsPublic,
		FollowersCount: v.FollowersCount,
		FollowingCount: v.FollowingCount,
		PublicTripCount: v.PublicTripCount,
		IsFollowing:    v.IsFollowing,
		CanViewContent: v.CanViewContent,
	}
}

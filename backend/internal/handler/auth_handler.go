package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
	"github.com/sudutkode/atur-perjalanan/backend/internal/platform/googleapi"
	"github.com/sudutkode/atur-perjalanan/backend/internal/platform/jwtutil"
)

// AuthHandler handles POST /v1/auth/* endpoints.
type AuthHandler struct {
	users     domain.UserService
	googleCID string
	jwtSecret []byte
}

// NewAuthHandler constructs an AuthHandler.
func NewAuthHandler(users domain.UserService, googleClientID string, jwtSecret []byte) *AuthHandler {
	return &AuthHandler{
		users:     users,
		googleCID: googleClientID,
		jwtSecret: jwtSecret,
	}
}

// ── Request / Response types ──────────────────────────────────────────────────

type googleAuthRequest struct {
	IDToken string `json:"id_token" binding:"required"`
}

type authResponse struct {
	AccessToken string   `json:"access_token"`
	IsNewUser   bool     `json:"is_new_user"`
	User        *userDTO `json:"user,omitempty"`
}

type completeRegistrationRequest struct {
	// 3–30 characters, letters and digits only (no spaces).
	Username string `json:"username" binding:"required,min=3,max=30,alphanum"`
}

// ── Handlers ──────────────────────────────────────────────────────────────────

// PostGoogle handles POST /v1/auth/google.
//
// Request:  { "id_token": "<Google ID token from the mobile client>" }
//
// Response (returning user):  { "access_token": "...", "is_new_user": false, "user": {...} }
// Response (new user):        { "access_token": "...", "is_new_user": true }
//
// When is_new_user is true the client must call POST /v1/auth/complete-registration
// (using the returned access_token) before accessing any other endpoint.
func (h *AuthHandler) PostGoogle(c *gin.Context) {
	var req googleAuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, "INVALID_REQUEST", "field id_token is required")
		return
	}

	googleClaims, err := googleapi.VerifyIDToken(c.Request.Context(), req.IDToken, h.googleCID)
	if err != nil {
		unauthorized(c, "INVALID_GOOGLE_TOKEN", "could not verify Google ID token")
		return
	}

	user, isNew, err := h.users.UpsertFromGoogle(c.Request.Context(), domain.GoogleAuthInput{
		GoogleID:  googleClaims.Subject,
		Email:     googleClaims.Email,
		Name:      googleClaims.Name,
		AvatarURL: googleClaims.AvatarURL,
	})
	if err != nil {
		internalError(c, err)
		return
	}

	token, err := jwtutil.Sign(user.ID, h.jwtSecret)
	if err != nil {
		internalError(c, err)
		return
	}

	resp := authResponse{
		AccessToken: token,
		IsNewUser:   isNew,
	}
	if !isNew {
		dto := toUserDTO(user)
		resp.User = &dto
	}
	c.JSON(http.StatusOK, resp)
}

// PostCompleteRegistration handles POST /v1/auth/complete-registration.
//
// Requires the Bearer JWT issued by PostGoogle (even for a brand-new user).
// Sets the user's permanent username and makes their profile publicly discoverable.
//
// Request:  { "username": "johndoe" }
// Response: { "user": {...} }
func (h *AuthHandler) PostCompleteRegistration(c *gin.Context) {
	userID := mustGetUserID(c)

	var req completeRegistrationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, "INVALID_USERNAME", "username must be 3–30 alphanumeric characters")
		return
	}

	user, err := h.users.CompleteRegistration(c.Request.Context(), userID, req.Username)
	if err != nil {
		switch err {
		case domain.ErrUsernameTaken:
			conflict(c, "USERNAME_TAKEN", "this username is already in use")
		case domain.ErrNotFound:
			notFound(c, "USER_NOT_FOUND", "user account not found")
		default:
			internalError(c, err)
		}
		return
	}

	dto := toUserDTO(user)
	c.JSON(http.StatusOK, gin.H{"user": dto})
}

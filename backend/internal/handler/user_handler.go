package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
	"github.com/sudutkode/atur-perjalanan/backend/internal/middleware"
)

// UserHandler handles /v1/users endpoints.
type UserHandler struct {
	users domain.UserService
	trips domain.TripService
}

func NewUserHandler(users domain.UserService, trips domain.TripService) *UserHandler {
	return &UserHandler{users: users, trips: trips}
}

func (h *UserHandler) RegisterRoutes(r gin.IRouter, jwtSecret []byte) {
	users := r.Group("/users")
	// Static paths must be registered BEFORE the :username wildcard.
	users.GET("/check-username", h.GetCheckUsername)
	users.GET("/search", h.Search)
	users.GET("/me", middleware.AuthRequired(jwtSecret), h.GetMe)
	users.PUT("/me", middleware.AuthRequired(jwtSecret), h.PutMe)
	users.GET("/:username", middleware.OptionalAuth(jwtSecret), h.GetProfile)
	users.GET("/:username/trips", middleware.OptionalAuth(jwtSecret), h.GetUserTrips)
	users.POST("/:username/follow", middleware.AuthRequired(jwtSecret), h.PostFollow)
	users.DELETE("/:username/follow", middleware.AuthRequired(jwtSecret), h.DeleteFollow)
}

type updateProfileRequest struct {
	Bio      *string `json:"bio" binding:"omitempty,max=500"`
	IsPublic *bool   `json:"is_public"`
}

func (h *UserHandler) GetMe(c *gin.Context) {
	userID := mustGetUserID(c)
	u, err := h.users.GetByID(c.Request.Context(), userID)
	if err != nil {
		if err == domain.ErrNotFound {
			notFound(c, "USER_NOT_FOUND", "user not found")
			return
		}
		internalError(c, err)
		return
	}
	c.JSON(http.StatusOK, toUserDTO(u))
}

func (h *UserHandler) PutMe(c *gin.Context) {
	userID := mustGetUserID(c)
	var req updateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, "INVALID_REQUEST", "invalid profile payload")
		return
	}
	u, err := h.users.UpdateProfile(c.Request.Context(), userID, domain.UpdateProfileInput{Bio: req.Bio, IsPublic: req.IsPublic})
	if err != nil {
		internalError(c, err)
		return
	}
	c.JSON(http.StatusOK, toUserDTO(u))
}

// GetProfile handles GET /v1/users/:username — privacy-aware public profile.
func (h *UserHandler) GetProfile(c *gin.Context) {
	username := c.Param("username")
	viewerID := optionalViewerID(c)
	view, err := h.users.GetProfileView(c.Request.Context(), username, viewerID)
	if err != nil {
		if err == domain.ErrNotFound {
			notFound(c, "USER_NOT_FOUND", "user not found")
			return
		}
		internalError(c, err)
		return
	}
	c.JSON(http.StatusOK, toProfileViewDTO(view))
}

// GetCheckUsername handles GET /v1/users/check-username?username=...
func (h *UserHandler) GetCheckUsername(c *gin.Context) {
	username := c.Query("username")
	if username == "" {
		badRequest(c, "EMPTY_USERNAME", "username query parameter is required")
		return
	}
	available, err := h.users.CheckUsernameAvailable(c.Request.Context(), username)
	if err != nil {
		internalError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"available": available})
}

// GetUserTrips handles GET /v1/users/:username/trips — privacy-gated trip grid.
func (h *UserHandler) GetUserTrips(c *gin.Context) {
	username := c.Param("username")
	viewerID := optionalViewerID(c)
	trips, err := h.trips.ListTripsByUser(c.Request.Context(), username, viewerID)
	if err != nil {
		switch err {
		case domain.ErrNotFound:
			notFound(c, "USER_NOT_FOUND", "user not found")
		case domain.ErrForbidden:
			forbidden(c, "PROFILE_PRIVATE", "this profile is private")
		default:
			internalError(c, err)
		}
		return
	}
	resp := make([]tripEnrichedResponse, 0, len(trips))
	for _, t := range trips {
		resp = append(resp, toTripEnrichedResponse(t))
	}
	c.JSON(http.StatusOK, resp)
}

func (h *UserHandler) PostFollow(c *gin.Context) {
	followerID := mustGetUserID(c)
	username := c.Param("username")
	target, err := h.users.GetProfile(c.Request.Context(), username, nil)
	if err != nil {
		handleUserError(c, err)
		return
	}
	if err := h.users.Follow(c.Request.Context(), followerID, target.ID); err != nil {
		handleUserError(c, err)
		return
	}
	c.Status(http.StatusCreated)
}

func (h *UserHandler) DeleteFollow(c *gin.Context) {
	followerID := mustGetUserID(c)
	username := c.Param("username")
	target, err := h.users.GetProfile(c.Request.Context(), username, nil)
	if err != nil {
		handleUserError(c, err)
		return
	}
	if err := h.users.Unfollow(c.Request.Context(), followerID, target.ID); err != nil {
		handleUserError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *UserHandler) Search(c *gin.Context) {
	q := c.Query("q")
	if q == "" {
		badRequest(c, "EMPTY_QUERY", "query parameter 'q' is required")
		return
	}
	limit := 20
	if l := c.Query("limit"); l != "" {
		if v, err := strconv.Atoi(l); err == nil {
			limit = v
		}
	}
	var cursor *uuid.UUID
	if cur := c.Query("cursor"); cur != "" {
		if id, err := uuid.Parse(cur); err == nil {
			cursor = &id
		} else {
			badRequest(c, "INVALID_CURSOR", "cursor must be a UUID")
			return
		}
	}
	users, err := h.users.Search(c.Request.Context(), q, limit, cursor)
	if err != nil {
		internalError(c, err)
		return
	}
	resp := make([]userDTO, 0, len(users))
	for _, u := range users {
		dto := toUserDTO(u)
		dto.Email = "" // never expose email in search results
		resp = append(resp, dto)
	}
	c.JSON(http.StatusOK, resp)
}

// optionalViewerID extracts the authenticated user ID from the Gin context when
// present (set by OptionalAuth middleware). Returns nil when unauthenticated.
func optionalViewerID(c *gin.Context) *uuid.UUID {
	raw, ok := c.Get("userID")
	if !ok {
		return nil
	}
	id, err := uuid.Parse(raw.(string))
	if err != nil {
		return nil
	}
	return &id
}

func handleUserError(c *gin.Context, err error) {
	switch err {
	case domain.ErrNotFound:
		notFound(c, "USER_NOT_FOUND", "user not found")
	case domain.ErrInvalidInput:
		badRequest(c, "INVALID_REQUEST", "invalid request")
	default:
		internalError(c, err)
	}
}

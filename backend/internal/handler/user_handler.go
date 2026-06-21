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
}

func NewUserHandler(users domain.UserService) *UserHandler {
    return &UserHandler{users: users}
}

func (h *UserHandler) RegisterRoutes(r gin.IRouter, jwtSecret []byte) {
    users := r.Group("/users")
    users.GET("/search", h.Search)
    users.GET("/me", middleware.AuthRequired(jwtSecret), h.GetMe)
    users.PUT("/me", middleware.AuthRequired(jwtSecret), h.PutMe)
    users.GET("/:username", h.GetProfile)
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

func (h *UserHandler) GetProfile(c *gin.Context) {
    username := c.Param("username")
    var viewerID *uuid.UUID
    if raw, ok := c.Get("userID"); ok {
        if id, err := uuid.Parse(raw.(string)); err == nil {
            viewerID = &id
        }
    }
    u, err := h.users.GetProfile(c.Request.Context(), username, viewerID)
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
    var resp []userDTO
    for _, u := range users {
        // omit email in search results
        dto := toUserDTO(u)
        dto.Email = ""
        resp = append(resp, dto)
    }
    c.JSON(http.StatusOK, resp)
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

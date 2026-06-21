package handler

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "github.com/google/uuid"

    "github.com/sudutkode/atur-perjalanan/backend/internal/domain"
    "github.com/sudutkode/atur-perjalanan/backend/internal/middleware"
)

type WishlistHandler struct {
    svc domain.WishlistService
}

func NewWishlistHandler(svc domain.WishlistService) *WishlistHandler {
    return &WishlistHandler{svc: svc}
}

func (h *WishlistHandler) RegisterRoutes(r gin.IRouter, jwtSecret []byte) {
    w := r.Group("/wishlists")
    w.Use(middleware.AuthRequired(jwtSecret))
    w.POST("/", h.PostWishlist)
    w.GET("/", h.GetWishlists)
    w.PUT(":id", h.PutWishlist)
    w.DELETE(":id", h.DeleteWishlist)
}

type createWishlistRequest struct {
    PlaceName     string                 `json:"place_name" binding:"required,min=1,max=255"`
    Link          *string                `json:"link"`
    Tags          []string               `json:"tags"`
    PriorityLevel domain.PriorityLevel   `json:"priority_level"`
}

type updateWishlistRequest struct {
    PlaceName     *string               `json:"place_name" binding:"omitempty,min=1,max=255"`
    Link          *string               `json:"link"`
    Tags          []string              `json:"tags"`
    PriorityLevel *domain.PriorityLevel `json:"priority_level"`
}

func (h *WishlistHandler) PostWishlist(c *gin.Context) {
    userID := mustGetUserID(c)
    var req createWishlistRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        badRequest(c, "INVALID_REQUEST", "invalid wishlist payload")
        return
    }
    w, err := h.svc.Create(c.Request.Context(), userID, domain.CreateWishlistInput{
        PlaceName:     req.PlaceName,
        Link:          req.Link,
        Tags:          req.Tags,
        PriorityLevel: req.PriorityLevel,
    })
    if err != nil {
        internalError(c, err)
        return
    }
    c.JSON(http.StatusCreated, w)
}

func (h *WishlistHandler) GetWishlists(c *gin.Context) {
    userID := mustGetUserID(c)
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
    var filter domain.WishlistFilter
    filter.Limit = limit
    filter.Cursor = cursor
    if p := c.Query("priority"); p != "" {
        pl := domain.PriorityLevel(p)
        filter.Priority = &pl
    }
    if tags := c.QueryArray("tag"); len(tags) > 0 {
        filter.Tags = tags
    }
    items, err := h.svc.List(c.Request.Context(), userID, filter)
    if err != nil {
        internalError(c, err)
        return
    }
    c.JSON(http.StatusOK, items)
}

func (h *WishlistHandler) PutWishlist(c *gin.Context) {
    userID := mustGetUserID(c)
    id, err := uuid.Parse(c.Param("id"))
    if err != nil {
        badRequest(c, "INVALID_ID", "id must be a valid UUID")
        return
    }
    var req updateWishlistRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        badRequest(c, "INVALID_REQUEST", "invalid wishlist update payload")
        return
    }
    w, err := h.svc.Update(c.Request.Context(), id, userID, domain.UpdateWishlistInput{
        PlaceName:     req.PlaceName,
        Link:          req.Link,
        Tags:          req.Tags,
        PriorityLevel: req.PriorityLevel,
    })
    if err != nil {
        handleWishlistError(c, err)
        return
    }
    c.JSON(http.StatusOK, w)
}

func (h *WishlistHandler) DeleteWishlist(c *gin.Context) {
    userID := mustGetUserID(c)
    id, err := uuid.Parse(c.Param("id"))
    if err != nil {
        badRequest(c, "INVALID_ID", "id must be a valid UUID")
        return
    }
    if err := h.svc.Delete(c.Request.Context(), id, userID); err != nil {
        handleWishlistError(c, err)
        return
    }
    c.Status(http.StatusNoContent)
}

func handleWishlistError(c *gin.Context, err error) {
    switch err {
    case domain.ErrNotFound:
        notFound(c, "WISHLIST_NOT_FOUND", "wishlist item not found")
    case domain.ErrForbidden:
        forbidden(c, "FORBIDDEN", "insufficient permissions")
    case domain.ErrInvalidInput:
        badRequest(c, "INVALID_REQUEST", "invalid input")
    default:
        internalError(c, err)
    }
}

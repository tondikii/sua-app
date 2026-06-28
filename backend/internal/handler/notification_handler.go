package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
	"github.com/sudutkode/atur-perjalanan/backend/internal/middleware"
)

// NotificationHandler handles /v1/notifications endpoints.
type NotificationHandler struct {
	notifications domain.NotificationService
}

func NewNotificationHandler(notifications domain.NotificationService) *NotificationHandler {
	return &NotificationHandler{notifications: notifications}
}

func (h *NotificationHandler) RegisterRoutes(r gin.IRouter, jwtSecret []byte) {
	notifs := r.Group("/notifications")
	notifs.Use(middleware.AuthRequired(jwtSecret))
	notifs.GET("/", h.ListNotifications)
	notifs.GET("/unread-count", h.GetUnreadCount)
	notifs.PUT("/:id/read", h.MarkRead)
	notifs.PUT("/read-all", h.MarkAllRead)
}

type notificationDTO struct {
	ID        string         `json:"id"`
	Type      string         `json:"type"`
	ActorID   *string        `json:"actor_id"`
	TripID    *string        `json:"trip_id"`
	Payload   map[string]any `json:"payload"`
	IsRead    bool           `json:"is_read"`
	CreatedAt time.Time      `json:"created_at"`
}

func toNotificationDTO(n *domain.Notification) notificationDTO {
	dto := notificationDTO{
		ID:        n.ID.String(),
		Type:      string(n.Type),
		Payload:   n.Payload,
		IsRead:    n.IsRead,
		CreatedAt: n.CreatedAt,
	}
	if n.ActorID != nil {
		s := n.ActorID.String()
		dto.ActorID = &s
	}
	if n.TripID != nil {
		s := n.TripID.String()
		dto.TripID = &s
	}
	return dto
}

// ListNotifications handles GET /v1/notifications
func (h *NotificationHandler) ListNotifications(c *gin.Context) {
	userID := mustGetUserID(c)
	var cursor *time.Time
	if cur := c.Query("cursor"); cur != "" {
		t, err := time.Parse(time.RFC3339, cur)
		if err != nil {
			badRequest(c, "INVALID_CURSOR", "cursor must be RFC3339 timestamp")
			return
		}
		cursor = &t
	}
	limit := 20
	notifs, err := h.notifications.ListNotifications(c.Request.Context(), userID, cursor, limit)
	if err != nil {
		internalError(c, err)
		return
	}
	resp := make([]notificationDTO, 0, len(notifs))
	for _, n := range notifs {
		resp = append(resp, toNotificationDTO(n))
	}
	c.JSON(http.StatusOK, resp)
}

// GetUnreadCount handles GET /v1/notifications/unread-count
func (h *NotificationHandler) GetUnreadCount(c *gin.Context) {
	userID := mustGetUserID(c)
	count, err := h.notifications.CountUnread(c.Request.Context(), userID)
	if err != nil {
		internalError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"unread_count": count})
}

// MarkRead handles PUT /v1/notifications/:id/read
func (h *NotificationHandler) MarkRead(c *gin.Context) {
	userID := mustGetUserID(c)
	notifID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		badRequest(c, "INVALID_ID", "notification ID must be a valid UUID")
		return
	}
	if err := h.notifications.MarkRead(c.Request.Context(), notifID, userID); err != nil {
		if err == domain.ErrNotFound {
			notFound(c, "NOTIFICATION_NOT_FOUND", "notification not found")
			return
		}
		internalError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

// MarkAllRead handles PUT /v1/notifications/read-all
func (h *NotificationHandler) MarkAllRead(c *gin.Context) {
	userID := mustGetUserID(c)
	if err := h.notifications.MarkAllRead(c.Request.Context(), userID); err != nil {
		internalError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

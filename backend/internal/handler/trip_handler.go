package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
	"github.com/sudutkode/atur-perjalanan/backend/internal/middleware"
)

// TripHandler handles /v1/trips endpoints.
type TripHandler struct {
	trips domain.TripService
}

func NewTripHandler(trips domain.TripService) *TripHandler {
	return &TripHandler{trips: trips}
}

type createTripRequest struct {
	Name       string             `json:"name" binding:"required,min=1,max=255"`
	Tags       []string           `json:"tags"`
	StartDate  *time.Time         `json:"start_date"`
	EndDate    *time.Time         `json:"end_date"`
	Candidates []domain.DateRange `json:"candidates"`
}

type updateTripRequest struct {
	Name      *string    `json:"name" binding:"omitempty,min=1,max=255"`
	Tags      []string   `json:"tags"`
	StartDate *time.Time `json:"start_date"`
	EndDate   *time.Time `json:"end_date"`
}

type inviteTripRequest struct {
	Username *string `json:"username" binding:"omitempty,alphanum,min=3,max=30"`
	Email    *string `json:"email" binding:"omitempty,email"`
}

type destinationRequest struct {
	PlaceName     string  `json:"place_name" binding:"required,min=1,max=255"`
	MapsLink      *string `json:"maps_link"`
	ReferenceLink *string `json:"reference_link"`
}

type messageRequest struct {
	Message string `json:"message" binding:"required,min=1,max=1000"`
}

type tripResponse struct {
	ID        string     `json:"id"`
	CreatorID string     `json:"creator_id"`
	Name      string     `json:"name"`
	Tags      []string   `json:"tags"`
	Status    string     `json:"status"`
	StartDate *time.Time `json:"start_date"`
	EndDate   *time.Time `json:"end_date"`
	IsPublic  bool       `json:"is_public"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

func toTripResponse(t *domain.Trip) tripResponse {
	return tripResponse{
		ID:        t.ID.String(),
		CreatorID: t.CreatorID.String(),
		Name:      t.Name,
		Tags:      t.Tags,
		Status:    string(t.Status),
		StartDate: t.StartDate,
		EndDate:   t.EndDate,
		IsPublic:  t.IsPublic,
		CreatedAt: t.CreatedAt,
		UpdatedAt: t.UpdatedAt,
	}
}

type destinationResponse struct {
	ID            string     `json:"id"`
	TripID        string     `json:"trip_id"`
	PlaceName     string     `json:"place_name"`
	MapsLink      *string    `json:"maps_link"`
	ReferenceLink *string    `json:"reference_link"`
	SortOrder     int        `json:"sort_order"`
	CreatedAt     time.Time  `json:"created_at"`
}

type messageResponse struct {
	ID          string    `json:"id"`
	TripID      string    `json:"trip_id"`
	SenderID    string    `json:"sender_id"`
	MessageText string    `json:"message_text"`
	CreatedAt   time.Time `json:"created_at"`
}

func toDestinationResponse(d *domain.TripDestination) destinationResponse {
	return destinationResponse{
		ID:            d.ID.String(),
		TripID:        d.TripID.String(),
		PlaceName:     d.PlaceName,
		MapsLink:      d.MapsLink,
		ReferenceLink: d.ReferenceLink,
		SortOrder:     d.SortOrder,
		CreatedAt:     d.CreatedAt,
	}
}

func toMessageResponse(m *domain.TripMessage) messageResponse {
	return messageResponse{
		ID:          m.ID.String(),
		TripID:      m.TripID.String(),
		SenderID:    m.SenderID.String(),
		MessageText: m.MessageText,
		CreatedAt:   m.CreatedAt,
	}
}

func (h *TripHandler) PostTrip(c *gin.Context) {
	userID := mustGetUserID(c)
	var req createTripRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, "INVALID_REQUEST", "invalid trip payload")
		return
	}
	trip, err := h.trips.CreateTrip(c.Request.Context(), userID, domain.CreateTripInput{
		Name:       req.Name,
		Tags:       req.Tags,
		StartDate:  req.StartDate,
		EndDate:    req.EndDate,
		Candidates: req.Candidates,
	})
	if err != nil {
		handleTripError(c, err)
		return
	}
	c.JSON(http.StatusCreated, toTripResponse(trip))
}

func (h *TripHandler) GetTrips(c *gin.Context) {
	userID := mustGetUserID(c)
	limit := 20
	cursorParam := c.Query("cursor")
	var cursor *uuid.UUID
	if cursorParam != "" {
		id, err := uuid.Parse(cursorParam)
		if err != nil {
			badRequest(c, "INVALID_CURSOR", "cursor must be a valid UUID")
			return
		}
		cursor = &id
	}
	trips, err := h.trips.ListTrips(c.Request.Context(), userID, cursor, limit)
	if err != nil {
		internalError(c, err)
		return
	}
	var resp []tripResponse
	for _, t := range trips {
		resp = append(resp, toTripResponse(t))
	}
	c.JSON(http.StatusOK, resp)
}

func (h *TripHandler) GetTrip(c *gin.Context) {
	userID := mustGetUserID(c)
	tripID, err := uuid.Parse(c.Param("tripId"))
	if err != nil {
		badRequest(c, "INVALID_TRIP_ID", "trip ID must be a valid UUID")
		return
	}
	trip, err := h.trips.GetTrip(c.Request.Context(), tripID, userID)
	if err != nil {
		handleTripError(c, err)
		return
	}
	c.JSON(http.StatusOK, toTripResponse(trip))
}

func (h *TripHandler) PutTrip(c *gin.Context) {
	userID := mustGetUserID(c)
	tripID, err := uuid.Parse(c.Param("tripId"))
	if err != nil {
		badRequest(c, "INVALID_TRIP_ID", "trip ID must be a valid UUID")
		return
	}
	var req updateTripRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, "INVALID_REQUEST", "invalid trip update payload")
		return
	}
	trip, err := h.trips.UpdateTrip(c.Request.Context(), tripID, userID, domain.UpdateTripInput{
		Name:      req.Name,
		Tags:      req.Tags,
		StartDate: req.StartDate,
		EndDate:   req.EndDate,
	})
	if err != nil {
		handleTripError(c, err)
		return
	}
	c.JSON(http.StatusOK, toTripResponse(trip))
}

func (h *TripHandler) DeleteTrip(c *gin.Context) {
	userID := mustGetUserID(c)
	tripID, err := uuid.Parse(c.Param("tripId"))
	if err != nil {
		badRequest(c, "INVALID_TRIP_ID", "trip ID must be a valid UUID")
		return
	}
	if err := h.trips.DeleteTrip(c.Request.Context(), tripID, userID); err != nil {
		handleTripError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *TripHandler) PostTripInvitation(c *gin.Context) {
	userID := mustGetUserID(c)
	tripID, err := uuid.Parse(c.Param("tripId"))
	if err != nil {
		badRequest(c, "INVALID_TRIP_ID", "trip ID must be a valid UUID")
		return
	}
	var req inviteTripRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, "INVALID_REQUEST", "invalid invitation payload")
		return
	}
	if req.Username == nil && req.Email == nil {
		badRequest(c, "INVALID_INVITATION_TARGET", "username or email is required")
		return
	}
	if err := h.trips.InviteParticipant(c.Request.Context(), tripID, userID, domain.InviteInput{Username: req.Username, Email: req.Email}); err != nil {
		handleTripError(c, err)
		return
	}
	c.Status(http.StatusCreated)
}

func (h *TripHandler) PostTripCandidateVote(c *gin.Context) {
	userID := mustGetUserID(c)
	candidateID, err := uuid.Parse(c.Param("candidateId"))
	if err != nil {
		badRequest(c, "INVALID_CANDIDATE_ID", "candidate ID must be a valid UUID")
		return
	}
	if err := h.trips.CastVote(c.Request.Context(), candidateID, userID); err != nil {
		handleTripError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *TripHandler) DeleteTripCandidateVote(c *gin.Context) {
	userID := mustGetUserID(c)
	candidateID, err := uuid.Parse(c.Param("candidateId"))
	if err != nil {
		badRequest(c, "INVALID_CANDIDATE_ID", "candidate ID must be a valid UUID")
		return
	}
	if err := h.trips.RetractVote(c.Request.Context(), candidateID, userID); err != nil {
		handleTripError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *TripHandler) PostTripCandidateLock(c *gin.Context) {
	userID := mustGetUserID(c)
	tripID, err := uuid.Parse(c.Param("tripId"))
	if err != nil {
		badRequest(c, "INVALID_TRIP_ID", "trip ID must be a valid UUID")
		return
	}
	candidateID, err := uuid.Parse(c.Param("candidateId"))
	if err != nil {
		badRequest(c, "INVALID_CANDIDATE_ID", "candidate ID must be a valid UUID")
		return
	}
	if err := h.trips.LockDate(c.Request.Context(), tripID, candidateID, userID); err != nil {
		handleTripError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *TripHandler) PostTripDestination(c *gin.Context) {
	userID := mustGetUserID(c)
	tripID, err := uuid.Parse(c.Param("tripId"))
	if err != nil {
		badRequest(c, "INVALID_TRIP_ID", "trip ID must be a valid UUID")
		return
	}
	var req destinationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, "INVALID_REQUEST", "invalid destination payload")
		return
	}
	dest, err := h.trips.AddDestination(c.Request.Context(), tripID, userID, domain.AddDestinationInput{
		PlaceName:     req.PlaceName,
		MapsLink:      req.MapsLink,
		ReferenceLink: req.ReferenceLink,
	})
	if err != nil {
		handleTripError(c, err)
		return
	}
	c.JSON(http.StatusCreated, toDestinationResponse(dest))
}

func (h *TripHandler) DeleteTripDestination(c *gin.Context) {
	userID := mustGetUserID(c)
	tripID, err := uuid.Parse(c.Param("tripId"))
	if err != nil {
		badRequest(c, "INVALID_TRIP_ID", "trip ID must be a valid UUID")
		return
	}
	destinationID, err := uuid.Parse(c.Param("destinationId"))
	if err != nil {
		badRequest(c, "INVALID_DESTINATION_ID", "destination ID must be a valid UUID")
		return
	}
	if err := h.trips.RemoveDestination(c.Request.Context(), destinationID, tripID, userID); err != nil {
		handleTripError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *TripHandler) GetTripDestinations(c *gin.Context) {
	userID := mustGetUserID(c)
	tripID, err := uuid.Parse(c.Param("tripId"))
	if err != nil {
		badRequest(c, "INVALID_TRIP_ID", "trip ID must be a valid UUID")
		return
	}
	dests, err := h.trips.ListDestinations(c.Request.Context(), tripID, userID)
	if err != nil {
		handleTripError(c, err)
		return
	}
	var resp []destinationResponse
	for _, d := range dests {
		resp = append(resp, toDestinationResponse(d))
	}
	c.JSON(http.StatusOK, resp)
}

func (h *TripHandler) GetTripDateCandidates(c *gin.Context) {
	userID := mustGetUserID(c)
	tripID, err := uuid.Parse(c.Param("tripId"))
	if err != nil {
		badRequest(c, "INVALID_TRIP_ID", "trip ID must be a valid UUID")
		return
	}
	candidates, err := h.trips.ListDateCandidates(c.Request.Context(), tripID, userID)
	if err != nil {
		handleTripError(c, err)
		return
	}
	c.JSON(http.StatusOK, candidates)
}

func (h *TripHandler) PostTripMessage(c *gin.Context) {
	userID := mustGetUserID(c)
	tripID, err := uuid.Parse(c.Param("tripId"))
	if err != nil {
		badRequest(c, "INVALID_TRIP_ID", "trip ID must be a valid UUID")
		return
	}
	var req messageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, "INVALID_REQUEST", "invalid message payload")
		return
	}
	msg, err := h.trips.SendMessage(c.Request.Context(), tripID, userID, req.Message)
	if err != nil {
		handleTripError(c, err)
		return
	}
	c.JSON(http.StatusCreated, toMessageResponse(msg))
}

func (h *TripHandler) GetTripMessages(c *gin.Context) {
	userID := mustGetUserID(c)
	tripID, err := uuid.Parse(c.Param("tripId"))
	if err != nil {
		badRequest(c, "INVALID_TRIP_ID", "trip ID must be a valid UUID")
		return
	}
	limit := 20
	cursorParam := c.Query("cursor")
	var cursor *time.Time
	if cursorParam != "" {
		parsed, err := time.Parse(time.RFC3339, cursorParam)
		if err != nil {
			badRequest(c, "INVALID_CURSOR", "cursor must be RFC3339 timestamp")
			return
		}
		cursor = &parsed
	}
	messages, err := h.trips.GetMessages(c.Request.Context(), tripID, userID, cursor, limit)
	if err != nil {
		handleTripError(c, err)
		return
	}
	var resp []messageResponse
	for _, m := range messages {
		resp = append(resp, toMessageResponse(m))
	}
	c.JSON(http.StatusOK, resp)
}

func handleTripError(c *gin.Context, err error) {
	switch err {
	case domain.ErrNotFound:
		notFound(c, "TRIP_NOT_FOUND", "trip not found")
	case domain.ErrForbidden:
		forbidden(c, "FORBIDDEN", "insufficient permissions")
	case domain.ErrInvalidInput:
		badRequest(c, "INVALID_REQUEST", "invalid request payload")
	case domain.ErrNotParticipant:
		forbidden(c, "NOT_PARTICIPANT", "user is not a participant of this trip")
	case domain.ErrNotCreator:
		forbidden(c, "NOT_CREATOR", "only the trip creator may perform this action")
	case domain.ErrInvitationNotPending:
		badRequest(c, "INVITATION_NOT_PENDING", "invitation is no longer pending")
	case domain.ErrAlreadyVoted:
		conflict(c, "ALREADY_VOTED", "user has already voted for this candidate")
	case domain.ErrVoteNotFound:
		notFound(c, "VOTE_NOT_FOUND", "vote not found")
	case domain.ErrTripAlreadyFixed:
		badRequest(c, "TRIP_ALREADY_FIXED", "trip date has already been locked")
	default:
		internalError(c, err)
	}
}

func (h *TripHandler) RegisterRoutes(r gin.IRouter, jwtSecret []byte) {
	trips := r.Group("/trips")
	trips.Use(middleware.AuthRequired(jwtSecret))
	trips.GET("/", h.GetTrips)
	trips.POST("/", h.PostTrip)
	trips.GET(":tripId", h.GetTrip)
	trips.PUT(":tripId", h.PutTrip)
	trips.DELETE(":tripId", h.DeleteTrip)
	trips.POST(":tripId/invitations", h.PostTripInvitation)
	trips.POST(":tripId/candidates/:candidateId/vote", h.PostTripCandidateVote)
	trips.DELETE(":tripId/candidates/:candidateId/vote", h.DeleteTripCandidateVote)
	trips.POST(":tripId/candidates/:candidateId/lock", h.PostTripCandidateLock)
	trips.GET(":tripId/destinations", h.GetTripDestinations)
	trips.POST(":tripId/destinations", h.PostTripDestination)
	trips.DELETE(":tripId/destinations/:destinationId", h.DeleteTripDestination)
	trips.GET(":tripId/candidates", h.GetTripDateCandidates)
	trips.GET(":tripId/messages", h.GetTripMessages)
	trips.POST(":tripId/messages", h.PostTripMessage)
}

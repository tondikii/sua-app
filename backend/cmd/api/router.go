package main

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/sudutkode/atur-perjalanan/backend/internal/config"
	"github.com/sudutkode/atur-perjalanan/backend/internal/handler"
	"github.com/sudutkode/atur-perjalanan/backend/internal/jobs"
	"github.com/sudutkode/atur-perjalanan/backend/internal/middleware"
	"github.com/sudutkode/atur-perjalanan/backend/internal/repository"
	"github.com/sudutkode/atur-perjalanan/backend/internal/service"
)

// buildRouter is the composition root: it wires repositories → services → handlers
// and registers all HTTP routes.
func buildRouter(cfg *config.Config, pool *pgxpool.Pool) http.Handler {
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.RequestID())

	// ── Repositories ──────────────────────────────────────────────────────────
	userRepo := repository.NewUserRepository(pool)
	followRepo := repository.NewFollowRepository(pool)
	wishlistRepo := repository.NewWishlistRepository(pool)
	tripRepo := repository.NewTripRepository(pool)
	tripInvitationRepo := repository.NewTripInvitationRepository(pool)
	tripCandidateRepo := repository.NewTripDateCandidateRepository(pool)
	tripDestinationRepo := repository.NewTripDestinationRepository(pool)
	tripMessageRepo := repository.NewTripMessageRepository(pool)
	notificationRepo := repository.NewNotificationRepository(pool)

	// ── Services ──────────────────────────────────────────────────────────────
	notificationSvc := service.NewNotificationService(notificationRepo, tripRepo)
	userSvc := service.NewUserService(userRepo, followRepo, notificationSvc)
	wishlistSvc := service.NewWishlistService(wishlistRepo)
	tripSvc := service.NewTripService(
		tripRepo,
		tripInvitationRepo,
		tripCandidateRepo,
		tripDestinationRepo,
		tripMessageRepo,
		userRepo,
		followRepo,
		pool,
		notificationSvc,
	)

	// ── Background jobs ────────────────────────────────────────────────────────
	jobs.StartVotingReminder(context.Background(), notificationRepo, notificationSvc)

	// ── Handlers ──────────────────────────────────────────────────────────────
	jwtSecret := []byte(cfg.JWTSecret)
	authHandler := handler.NewAuthHandler(userSvc, cfg.GoogleClientID, jwtSecret)
	tripHandler := handler.NewTripHandler(tripSvc)
	userHandler := handler.NewUserHandler(userSvc, tripSvc)
	wishlistHandler := handler.NewWishlistHandler(wishlistSvc)
	notificationHandler := handler.NewNotificationHandler(notificationSvc)

	// ── Health check — unauthenticated, not rate-limited ──────────────────────
	r.GET("/health", func(c *gin.Context) {
		if err := pool.Ping(c.Request.Context()); err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"status": "unhealthy",
				"error":  "database unreachable",
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
			"time":   time.Now().UTC().Format(time.RFC3339),
		})
	})

	// ── v1 API — rate-limited ─────────────────────────────────────────────────
	v1 := r.Group("/v1")
	v1.Use(middleware.RateLimiter(120))

	// Auth
	auth := v1.Group("/auth")
	{
		auth.POST("/google", authHandler.PostGoogle)
		auth.POST("/complete-registration",
			middleware.AuthRequired(jwtSecret),
			authHandler.PostCompleteRegistration,
		)
	}

	// Trips, Users, Wishlists, Notifications
	tripHandler.RegisterRoutes(v1, jwtSecret)
	userHandler.RegisterRoutes(v1, jwtSecret)
	wishlistHandler.RegisterRoutes(v1, jwtSecret)
	notificationHandler.RegisterRoutes(v1, jwtSecret)

	return r
}

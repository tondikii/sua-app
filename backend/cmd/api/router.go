package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/sudutkode/atur-perjalanan/backend/internal/config"
	"github.com/sudutkode/atur-perjalanan/backend/internal/handler"
	"github.com/sudutkode/atur-perjalanan/backend/internal/middleware"
	"github.com/sudutkode/atur-perjalanan/backend/internal/repository"
	"github.com/sudutkode/atur-perjalanan/backend/internal/service"
)

// buildRouter is the composition root: it wires repositories → services → handlers
// and registers all HTTP routes. Add new phases here as they are implemented.
func buildRouter(cfg *config.Config, pool *pgxpool.Pool) http.Handler {
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(requestIDMiddleware())

	// ── Repositories ──────────────────────────────────────────────────────────
	userRepo   := repository.NewUserRepository(pool)
	followRepo := repository.NewFollowRepository(pool)

	// ── Services ──────────────────────────────────────────────────────────────
	userSvc := service.NewUserService(userRepo, followRepo)

	// ── Handlers ──────────────────────────────────────────────────────────────
	jwtSecret  := []byte(cfg.JWTSecret)
	authHandler := handler.NewAuthHandler(userSvc, cfg.GoogleClientID, jwtSecret)

	// ── Health check — unauthenticated ────────────────────────────────────────
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

	// ── v1 API ────────────────────────────────────────────────────────────────
	v1 := r.Group("/v1")

	// Phase 2 — Authentication
	auth := v1.Group("/auth")
	{
		auth.POST("/google", authHandler.PostGoogle)
		auth.POST("/complete-registration",
			middleware.AuthRequired(jwtSecret),
			authHandler.PostCompleteRegistration,
		)
	}

	// Phase 3 — Trip APIs       (registered in next phase)
	// Phase 4 — Secondary APIs  (registered in next phase)

	return r
}

// requestIDMiddleware propagates or generates a correlation ID for every request.
func requestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		reqID := c.GetHeader("X-Request-ID")
		if reqID == "" {
			reqID = uuid.NewString()
		}
		c.Set("requestID", reqID)
		c.Header("X-Request-ID", reqID)
		c.Next()
	}
}

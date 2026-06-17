package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/sudutkode/atur-perjalanan/backend/internal/config"
)

// buildRouter wires all middleware and routes, returning the composed http.Handler.
// Feature routes are registered here as each phase is implemented.
func buildRouter(cfg *config.Config, pool *pgxpool.Pool) http.Handler {
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()

	// Global middleware
	r.Use(gin.Recovery())
	r.Use(requestIDMiddleware())

	// Health check — unauthenticated, used by Docker health checks and load balancers.
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

	// Versioned API group — feature routes are registered here in subsequent phases.
	// v1 := r.Group("/v1")
	// registerAuthRoutes(v1, ...)
	// registerUserRoutes(v1, ...)
	// registerTripRoutes(v1, ...)
	// registerWishlistRoutes(v1, ...)

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

package middleware

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

const (
	rateLimitWindow  = time.Minute
	rateLimitCleanup = 5 * time.Minute
)

// ipWindow tracks the request timestamps for a single IP within a sliding window.
type ipWindow struct {
	mu   sync.Mutex
	hits []time.Time
}

// allow returns true if the IP has not exceeded limit requests within window.
func (w *ipWindow) allow(limit int, window time.Duration) bool {
	w.mu.Lock()
	defer w.mu.Unlock()

	now := time.Now()
	cutoff := now.Add(-window)

	// Evict timestamps that have fallen outside the window.
	valid := w.hits[:0]
	for _, t := range w.hits {
		if t.After(cutoff) {
			valid = append(valid, t)
		}
	}
	w.hits = valid

	if len(w.hits) >= limit {
		return false
	}
	w.hits = append(w.hits, now)
	return true
}

// rateLimiter holds per-IP state and manages background cleanup.
type rateLimiter struct {
	mu      sync.Mutex
	windows map[string]*ipWindow
}

func newRateLimiter() *rateLimiter {
	rl := &rateLimiter{windows: make(map[string]*ipWindow)}
	go rl.cleanup()
	return rl
}

func (rl *rateLimiter) window(ip string) *ipWindow {
	rl.mu.Lock()
	defer rl.mu.Unlock()
	w, ok := rl.windows[ip]
	if !ok {
		w = &ipWindow{}
		rl.windows[ip] = w
	}
	return w
}

// cleanup periodically removes idle entries to prevent unbounded memory growth.
func (rl *rateLimiter) cleanup() {
	ticker := time.NewTicker(rateLimitCleanup)
	defer ticker.Stop()
	for range ticker.C {
		cutoff := time.Now().Add(-rateLimitWindow)
		rl.mu.Lock()
		for ip, w := range rl.windows {
			w.mu.Lock()
			if len(w.hits) == 0 || w.hits[len(w.hits)-1].Before(cutoff) {
				delete(rl.windows, ip)
			}
			w.mu.Unlock()
		}
		rl.mu.Unlock()
	}
}

// RateLimiter returns a per-IP sliding-window rate limiter middleware.
// limit is the maximum number of requests per minute per IP address.
// Set limit ≤ 0 to use the default of 60 req/min.
func RateLimiter(limit int) gin.HandlerFunc {
	if limit <= 0 {
		limit = 60
	}
	rl := newRateLimiter()

	return func(c *gin.Context) {
		ip := extractClientIP(c)
		if !rl.window(ip).allow(limit, rateLimitWindow) {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, map[string]any{
				"error": map[string]string{
					"code":    "RATE_LIMIT_EXCEEDED",
					"message": "too many requests, please slow down",
				},
			})
			return
		}
		c.Next()
	}
}

// extractClientIP returns the real client IP, respecting X-Forwarded-For when set.
func extractClientIP(c *gin.Context) string {
	if xff := c.GetHeader("X-Forwarded-For"); xff != "" {
		// Use the leftmost IP (the original client) from the chain.
		parts := strings.SplitN(xff, ",", 2)
		if ip := strings.TrimSpace(parts[0]); ip != "" {
			return ip
		}
	}
	ip, _, err := net.SplitHostPort(c.Request.RemoteAddr)
	if err != nil {
		return c.Request.RemoteAddr
	}
	return ip
}

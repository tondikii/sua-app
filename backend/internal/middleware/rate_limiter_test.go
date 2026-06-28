package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func newRateLimitRouter(limit int) *gin.Engine {
	r := gin.New()
	r.Use(RateLimiter(limit))
	r.GET("/ping", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})
	return r
}

func TestRateLimiter_AllowsUnderLimit(t *testing.T) {
	r := newRateLimitRouter(5)

	for i := 0; i < 5; i++ {
		req := httptest.NewRequest(http.MethodGet, "/ping", nil)
		req.RemoteAddr = "192.0.2.1:1234"
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Errorf("request %d: expected 200, got %d", i+1, w.Code)
		}
	}
}

func TestRateLimiter_BlocksOverLimit(t *testing.T) {
	r := newRateLimitRouter(3)

	ip := "192.0.2.2:5678"
	for i := 0; i < 3; i++ {
		req := httptest.NewRequest(http.MethodGet, "/ping", nil)
		req.RemoteAddr = ip
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("request %d: expected 200, got %d", i+1, w.Code)
		}
	}

	// The 4th request should be rate-limited.
	req := httptest.NewRequest(http.MethodGet, "/ping", nil)
	req.RemoteAddr = ip
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusTooManyRequests {
		t.Errorf("expected 429 after exceeding limit, got %d", w.Code)
	}
}

func TestRateLimiter_IsolatesIPs(t *testing.T) {
	r := newRateLimitRouter(2)

	// Exhaust limit for IP A.
	for i := 0; i < 2; i++ {
		req := httptest.NewRequest(http.MethodGet, "/ping", nil)
		req.RemoteAddr = "10.0.0.1:1111"
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
	}

	// IP B should still be allowed.
	req := httptest.NewRequest(http.MethodGet, "/ping", nil)
	req.RemoteAddr = "10.0.0.2:2222"
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("IP B should not be rate-limited, got %d", w.Code)
	}
}

func TestRateLimiter_RespectsXForwardedFor(t *testing.T) {
	r := newRateLimitRouter(2)

	for i := 0; i < 2; i++ {
		req := httptest.NewRequest(http.MethodGet, "/ping", nil)
		req.Header.Set("X-Forwarded-For", "203.0.113.5, 10.0.0.1")
		req.RemoteAddr = "10.0.0.1:9999" // proxy IP
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
	}

	// 3rd request from the same real client IP should be blocked.
	req := httptest.NewRequest(http.MethodGet, "/ping", nil)
	req.Header.Set("X-Forwarded-For", "203.0.113.5, 10.0.0.1")
	req.RemoteAddr = "10.0.0.1:9999"
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusTooManyRequests {
		t.Errorf("expected 429 for X-Forwarded-For client, got %d", w.Code)
	}
}

func TestRateLimiter_DefaultLimit(t *testing.T) {
	// limit <= 0 should use the default (60).
	r := newRateLimitRouter(0)
	req := httptest.NewRequest(http.MethodGet, "/ping", nil)
	req.RemoteAddr = "198.51.100.1:1234"
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200 with default limit, got %d", w.Code)
	}
}

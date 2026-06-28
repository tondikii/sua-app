package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestRequestID_GeneratesIDWhenMissing(t *testing.T) {
	r := gin.New()
	r.Use(RequestID())
	r.GET("/test", func(c *gin.Context) {
		id := c.GetString("requestID")
		c.JSON(http.StatusOK, gin.H{"request_id": id})
	})

	req := httptest.NewRequest(http.MethodGet, "/test", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
	if got := w.Header().Get(RequestIDHeader); got == "" {
		t.Error("expected X-Request-ID header to be set in response")
	}
}

func TestRequestID_PropagatesExistingID(t *testing.T) {
	r := gin.New()
	r.Use(RequestID())
	r.GET("/test", func(c *gin.Context) {
		id := c.GetString("requestID")
		c.JSON(http.StatusOK, gin.H{"request_id": id})
	})

	const existingID = "my-trace-id-abc123"
	req := httptest.NewRequest(http.MethodGet, "/test", nil)
	req.Header.Set(RequestIDHeader, existingID)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if got := w.Header().Get(RequestIDHeader); got != existingID {
		t.Errorf("expected response X-Request-ID = %q, got %q", existingID, got)
	}
}

func TestRequestID_UniquePerRequest(t *testing.T) {
	r := gin.New()
	r.Use(RequestID())
	r.GET("/test", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	ids := make(map[string]bool)
	for i := 0; i < 10; i++ {
		req := httptest.NewRequest(http.MethodGet, "/test", nil)
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
		id := w.Header().Get(RequestIDHeader)
		if ids[id] {
			t.Errorf("duplicate request ID generated: %s", id)
		}
		ids[id] = true
	}
}

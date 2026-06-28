package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/sudutkode/atur-perjalanan/backend/internal/platform/jwtutil"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func newAuthRouter(secret []byte) *gin.Engine {
	r := gin.New()
	r.GET("/protected", AuthRequired(secret), func(c *gin.Context) {
		userID := c.GetString("userID")
		c.JSON(http.StatusOK, gin.H{"user_id": userID})
	})
	return r
}

func TestAuthRequired_ValidToken(t *testing.T) {
	secret := []byte("test-secret-at-least-32-bytes-lo")
	userID := uuid.New()
	token, _ := jwtutil.Sign(userID, secret)

	r := newAuthRouter(secret)
	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
}

func TestAuthRequired_MissingToken(t *testing.T) {
	secret := []byte("test-secret-at-least-32-bytes-lo")
	r := newAuthRouter(secret)
	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected 401 for missing token, got %d", w.Code)
	}
}

func TestAuthRequired_InvalidToken(t *testing.T) {
	secret := []byte("test-secret-at-least-32-bytes-lo")
	r := newAuthRouter(secret)
	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Bearer invalid.token.here")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected 401 for invalid token, got %d", w.Code)
	}
}

func TestAuthRequired_WrongSecret(t *testing.T) {
	correctSecret := []byte("correct-secret-at-least-32bytes!")
	wrongSecret := []byte("wrong-secret-at-least-32-bytes!!")

	userID := uuid.New()
	token, _ := jwtutil.Sign(userID, correctSecret)

	r := newAuthRouter(wrongSecret)
	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected 401 for wrong secret, got %d", w.Code)
	}
}

func TestAuthRequired_BearerCaseInsensitive(t *testing.T) {
	// The Authorization header must start with exactly "Bearer " (capital B).
	secret := []byte("test-secret-at-least-32-bytes-lo")
	userID := uuid.New()
	token, _ := jwtutil.Sign(userID, secret)

	r := newAuthRouter(secret)
	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "bearer "+token) // lowercase 'b'
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Our extractBearer checks for exact prefix "Bearer " so lowercase should fail.
	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected 401 for lowercase bearer prefix, got %d", w.Code)
	}
}

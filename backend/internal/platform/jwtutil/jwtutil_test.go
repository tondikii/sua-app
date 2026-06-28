package jwtutil

import (
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

func TestSignAndVerify_RoundTrip(t *testing.T) {
	secret := []byte("test-secret-at-least-32-bytes-long!")
	userID := uuid.New()

	token, err := Sign(userID, secret)
	if err != nil {
		t.Fatalf("Sign() error = %v", err)
	}
	if token == "" {
		t.Fatal("Sign() returned empty token")
	}

	got, err := Verify(token, secret)
	if err != nil {
		t.Fatalf("Verify() error = %v", err)
	}
	if got != userID {
		t.Errorf("Verify() got userID = %v, want %v", got, userID)
	}
}

func TestVerify_WrongSecret(t *testing.T) {
	userID := uuid.New()
	token, _ := Sign(userID, []byte("correct-secret-32bytes-padding!!"))

	_, err := Verify(token, []byte("wrong-secret-32bytes-padding!!!!"))
	if err == nil {
		t.Error("Verify() expected error with wrong secret, got nil")
	}
}

func TestVerify_TamperedToken(t *testing.T) {
	secret := []byte("test-secret-at-least-32-bytes-lo")
	userID := uuid.New()
	token, _ := Sign(userID, secret)

	_, err := Verify(token+"tampered", secret)
	if err == nil {
		t.Error("Verify() expected error for tampered token, got nil")
	}
}

func TestVerify_ExpiredToken(t *testing.T) {
	secret := []byte("test-secret-at-least-32-bytes-lo")
	userID := uuid.New()

	// Build an already-expired token manually.
	past := time.Now().Add(-2 * time.Hour)
	c := claims{
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID.String(),
			IssuedAt:  jwt.NewNumericDate(past),
			ExpiresAt: jwt.NewNumericDate(past.Add(time.Hour)),
		},
	}
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
	signed, _ := tok.SignedString(secret)

	_, err := Verify(signed, secret)
	if err == nil {
		t.Error("Verify() expected error for expired token, got nil")
	}
}

func TestVerify_InvalidSubject(t *testing.T) {
	secret := []byte("test-secret-at-least-32-bytes-lo")
	now := time.Now()
	c := claims{
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   "not-a-uuid",
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(tokenExpiry)),
		},
	}
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
	signed, _ := tok.SignedString(secret)

	_, err := Verify(signed, secret)
	if err == nil {
		t.Error("Verify() expected error for non-UUID subject, got nil")
	}
}

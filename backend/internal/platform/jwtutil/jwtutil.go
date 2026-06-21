package jwtutil

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

const tokenExpiry = 24 * time.Hour

// claims is the internal JWT payload.
// Per architecture contract: only 'sub' (user UUID) and 'exp' are stored.
// No sensitive user data is embedded.
type claims struct {
	jwt.RegisteredClaims
}

// Sign creates a signed HS256 JWT with the given user ID as the subject.
func Sign(userID uuid.UUID, secret []byte) (string, error) {
	now := time.Now()
	c := claims{
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID.String(),
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(tokenExpiry)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
	signed, err := token.SignedString(secret)
	if err != nil {
		return "", fmt.Errorf("jwtutil: sign: %w", err)
	}
	return signed, nil
}

// Verify parses and validates a signed JWT, returning the subject as a user UUID.
func Verify(tokenString string, secret []byte) (uuid.UUID, error) {
	token, err := jwt.ParseWithClaims(tokenString, &claims{}, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("jwtutil: unexpected signing method %q", t.Header["alg"])
		}
		return secret, nil
	})
	if err != nil {
		return uuid.Nil, fmt.Errorf("jwtutil: verify: %w", err)
	}

	c, ok := token.Claims.(*claims)
	if !ok || !token.Valid {
		return uuid.Nil, fmt.Errorf("jwtutil: invalid claims")
	}

	id, err := uuid.Parse(c.Subject)
	if err != nil {
		return uuid.Nil, fmt.Errorf("jwtutil: invalid subject UUID: %w", err)
	}
	return id, nil
}

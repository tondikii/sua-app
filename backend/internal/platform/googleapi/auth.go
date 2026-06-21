package googleapi

import (
	"context"
	"fmt"

	"google.golang.org/api/idtoken"
)

// GoogleClaims holds the verified user claims extracted from a Google ID token.
type GoogleClaims struct {
	Subject   string // Google user ID ('sub' claim)
	Email     string
	Name      string
	AvatarURL string
}

// VerifyIDToken validates a Google ID token against Google's public JWKS and returns
// the verified claims. Keys are fetched once and cached in memory — subsequent
// validations are purely local crypto operations with no external network calls.
//
// audience must equal the GOOGLE_CLIENT_ID env var (the OAuth 2.0 Client ID
// registered in Google Cloud Console).
func VerifyIDToken(ctx context.Context, rawIDToken, audience string) (*GoogleClaims, error) {
	payload, err := idtoken.Validate(ctx, rawIDToken, audience)
	if err != nil {
		return nil, fmt.Errorf("googleapi: invalid ID token: %w", err)
	}

	c := &GoogleClaims{Subject: payload.Subject}
	if v, ok := payload.Claims["email"].(string); ok {
		c.Email = v
	}
	if v, ok := payload.Claims["name"].(string); ok {
		c.Name = v
	}
	if v, ok := payload.Claims["picture"].(string); ok {
		c.AvatarURL = v
	}
	return c, nil
}

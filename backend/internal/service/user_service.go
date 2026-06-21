package service

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

type userService struct {
	users   domain.UserRepository
	follows domain.FollowRepository
}

// NewUserService returns a domain.UserService backed by the provided repositories.
func NewUserService(users domain.UserRepository, follows domain.FollowRepository) domain.UserService {
	return &userService{users: users, follows: follows}
}

// UpsertFromGoogle finds or creates a user from a verified Google ID token payload.
//
// Returning user: refreshes name and avatar from Google, returns isNew=false.
//
// New user: creates a record with a temporary UUID placeholder username and
// is_public=false. The placeholder is replaced when the client calls
// CompleteRegistration. isNew=true signals the client to show the username form.
func (s *userService) UpsertFromGoogle(ctx context.Context, input domain.GoogleAuthInput) (*domain.User, bool, error) {
	user, err := s.users.FindByGoogleID(ctx, input.GoogleID)
	if err == nil {
		// Returning user — refresh mutable Google profile fields.
		user.Name = input.Name
		if input.AvatarURL != "" {
			user.AvatarURL = &input.AvatarURL
		}
		if updateErr := s.users.Update(ctx, user); updateErr != nil {
			return nil, false, fmt.Errorf("user_service: refresh google profile: %w", updateErr)
		}
		// isNew is true if the placeholder username is still in place.
		isNew := user.Username == user.ID.String()
		return user, isNew, nil
	}
	if err != domain.ErrNotFound {
		return nil, false, fmt.Errorf("user_service: lookup by google_id: %w", err)
	}

	// New user — create record with temporary placeholder username.
	id := uuid.New()
	newUser := &domain.User{
		ID:       id,
		GoogleID: input.GoogleID,
		Email:    input.Email,
		Name:     input.Name,
		Username: id.String(), // replaced by CompleteRegistration
		IsPublic: false,       // hidden until registration is complete
	}
	if input.AvatarURL != "" {
		newUser.AvatarURL = &input.AvatarURL
	}
	if err := s.users.Create(ctx, newUser); err != nil {
		return nil, false, fmt.Errorf("user_service: create user: %w", err)
	}
	return newUser, true, nil
}

// CompleteRegistration assigns a permanent username and activates the user's profile.
func (s *userService) CompleteRegistration(ctx context.Context, userID uuid.UUID, username string) (*domain.User, error) {
	taken, err := s.users.IsUsernameTaken(ctx, username)
	if err != nil {
		return nil, fmt.Errorf("user_service: check username availability: %w", err)
	}
	if taken {
		return nil, domain.ErrUsernameTaken
	}

	user, err := s.users.FindByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	user.Username = username
	user.IsPublic = true
	if err := s.users.Update(ctx, user); err != nil {
		return nil, fmt.Errorf("user_service: set username: %w", err)
	}
	return user, nil
}

// GetProfile returns a user's public profile. Returns ErrNotFound for private
// profiles when the viewer is not the profile owner.
func (s *userService) GetProfile(ctx context.Context, username string, viewerID *uuid.UUID) (*domain.User, error) {
	user, err := s.users.FindByUsername(ctx, username)
	if err != nil {
		return nil, err
	}
	if !user.IsPublic {
		if viewerID == nil || *viewerID != user.ID {
			return nil, domain.ErrNotFound
		}
	}
	return user, nil
}

// UpdateProfile applies partial updates to the authenticated user's own profile.
func (s *userService) UpdateProfile(ctx context.Context, userID uuid.UUID, input domain.UpdateProfileInput) (*domain.User, error) {
	user, err := s.users.FindByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if input.Bio != nil {
		user.Bio = input.Bio
	}
	if input.IsPublic != nil {
		user.IsPublic = *input.IsPublic
	}
	if err := s.users.Update(ctx, user); err != nil {
		return nil, fmt.Errorf("user_service: update profile: %w", err)
	}
	return user, nil
}

func (s *userService) Follow(ctx context.Context, followerID, followingID uuid.UUID) error {
	if followerID == followingID {
		return domain.ErrInvalidInput
	}
	if _, err := s.users.FindByID(ctx, followingID); err != nil {
		return err
	}
	return s.follows.Create(ctx, followerID, followingID)
}

func (s *userService) Unfollow(ctx context.Context, followerID, followingID uuid.UUID) error {
	return s.follows.Delete(ctx, followerID, followingID)
}

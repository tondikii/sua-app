package service

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

type userService struct {
	users         domain.UserRepository
	follows       domain.FollowRepository
	notifications domain.NotificationWriter // optional; nil = skip notifications
}

// NewUserService returns a domain.UserService backed by the provided repositories.
// notifications may be nil; when nil notification writes are skipped silently.
func NewUserService(users domain.UserRepository, follows domain.FollowRepository, notifications domain.NotificationWriter) domain.UserService {
	return &userService{users: users, follows: follows, notifications: notifications}
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

// GetProfile looks up a user by username without privacy enforcement.
// Used internally by follow/unfollow handlers that need the raw user record.
func (s *userService) GetProfile(ctx context.Context, username string, _ *uuid.UUID) (*domain.User, error) {
	return s.users.FindByUsername(ctx, username)
}

// GetProfileView returns the privacy-aware public profile for GET /v1/users/:username.
// Private accounts return a limited view with can_view_content=false for non-followers.
func (s *userService) GetProfileView(ctx context.Context, username string, viewerID *uuid.UUID) (*domain.ProfileView, error) {
	user, err := s.users.FindByUsername(ctx, username)
	if err != nil {
		return nil, err
	}

	view := &domain.ProfileView{User: *user}

	// Determine can_view_content.
	isOwner := viewerID != nil && *viewerID == user.ID
	if isOwner {
		view.CanViewContent = true
	} else if user.IsPublic {
		view.CanViewContent = true
	} else if viewerID != nil {
		following, err := s.follows.IsFollowing(ctx, *viewerID, user.ID)
		if err != nil {
			return nil, fmt.Errorf("user_service: check following: %w", err)
		}
		view.CanViewContent = following
		view.IsFollowing = following
	}
	// If !can_view_content: hide bio.
	if !view.CanViewContent {
		view.Bio = nil
	}
	// Always populate counts (visible even for private profiles per spec).
	view.FollowersCount, err = s.follows.CountFollowers(ctx, user.ID)
	if err != nil {
		return nil, fmt.Errorf("user_service: count followers: %w", err)
	}
	view.FollowingCount, err = s.follows.CountFollowing(ctx, user.ID)
	if err != nil {
		return nil, fmt.Errorf("user_service: count following: %w", err)
	}
	view.PublicTripCount, err = s.users.CountPublicTrips(ctx, user.ID)
	if err != nil {
		return nil, fmt.Errorf("user_service: count public trips: %w", err)
	}
	// is_following for non-owner viewers (may already be set above if private).
	if !isOwner && viewerID != nil && !view.IsFollowing {
		view.IsFollowing, err = s.follows.IsFollowing(ctx, *viewerID, user.ID)
		if err != nil {
			return nil, fmt.Errorf("user_service: is_following: %w", err)
		}
	}
	return view, nil
}

// CheckUsernameAvailable returns true when the username is not taken.
func (s *userService) CheckUsernameAvailable(ctx context.Context, username string) (bool, error) {
	taken, err := s.users.IsUsernameTaken(ctx, username)
	if err != nil {
		return false, fmt.Errorf("user_service: check username: %w", err)
	}
	return !taken, nil
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

func (s *userService) GetByID(ctx context.Context, userID uuid.UUID) (*domain.User, error) {
	return s.users.FindByID(ctx, userID)
}

func (s *userService) Follow(ctx context.Context, followerID, followingID uuid.UUID) error {
	if followerID == followingID {
		return domain.ErrInvalidInput
	}
	if _, err := s.users.FindByID(ctx, followingID); err != nil {
		return err
	}
	if err := s.follows.Create(ctx, followerID, followingID); err != nil {
		return err
	}
	// Best-effort notification (non-blocking).
	if s.notifications != nil {
		go func() {
			_ = s.notifications.NotifyFollow(context.Background(), followingID, followerID)
		}()
	}
	return nil
}

func (s *userService) Unfollow(ctx context.Context, followerID, followingID uuid.UUID) error {
	return s.follows.Delete(ctx, followerID, followingID)
}

func (s *userService) Search(ctx context.Context, query string, limit int, cursor *uuid.UUID) ([]*domain.User, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	return s.users.SearchByQuery(ctx, query, limit, cursor)
}

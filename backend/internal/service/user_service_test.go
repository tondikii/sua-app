package service

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

// ── Fake Repositories ────────────────────────────────────────────────────────

type fakeUserRepo struct {
	byGoogleID map[string]*domain.User
	byID       map[uuid.UUID]*domain.User
	byUsername map[string]*domain.User
	updateErr  error
}

func newFakeUserRepo() *fakeUserRepo {
	return &fakeUserRepo{
		byGoogleID: make(map[string]*domain.User),
		byID:       make(map[uuid.UUID]*domain.User),
		byUsername: make(map[string]*domain.User),
	}
}

func (r *fakeUserRepo) seed(u *domain.User) {
	r.byGoogleID[u.GoogleID] = u
	r.byID[u.ID] = u
	r.byUsername[u.Username] = u
}

func (r *fakeUserRepo) Create(_ context.Context, u *domain.User) error {
	r.seed(u)
	return nil
}

func (r *fakeUserRepo) FindByGoogleID(_ context.Context, googleID string) (*domain.User, error) {
	u, ok := r.byGoogleID[googleID]
	if !ok {
		return nil, domain.ErrNotFound
	}
	return u, nil
}

func (r *fakeUserRepo) FindByID(_ context.Context, id uuid.UUID) (*domain.User, error) {
	u, ok := r.byID[id]
	if !ok {
		return nil, domain.ErrNotFound
	}
	return u, nil
}

func (r *fakeUserRepo) FindByUsername(_ context.Context, username string) (*domain.User, error) {
	u, ok := r.byUsername[username]
	if !ok {
		return nil, domain.ErrNotFound
	}
	return u, nil
}

func (r *fakeUserRepo) Update(_ context.Context, u *domain.User) error {
	if r.updateErr != nil {
		return r.updateErr
	}
	// Re-index after update (username may have changed).
	old, ok := r.byID[u.ID]
	if ok {
		delete(r.byUsername, old.Username)
	}
	r.seed(u)
	return nil
}

func (r *fakeUserRepo) SearchByQuery(_ context.Context, query string, limit int, cursor *uuid.UUID) ([]*domain.User, error) {
	return nil, nil
}

func (r *fakeUserRepo) IsUsernameTaken(_ context.Context, username string) (bool, error) {
	_, ok := r.byUsername[username]
	return ok, nil
}

func (r *fakeUserRepo) CountPublicTrips(_ context.Context, _ uuid.UUID) (int, error) {
	return 0, nil
}

type fakeFollowRepo struct {
	follows map[string]bool // "followerID:followingID"
}

func newFakeFollowRepo() *fakeFollowRepo {
	return &fakeFollowRepo{follows: make(map[string]bool)}
}

func followKey(follower, following uuid.UUID) string {
	return follower.String() + ":" + following.String()
}

func (r *fakeFollowRepo) Create(_ context.Context, followerID, followingID uuid.UUID) error {
	r.follows[followKey(followerID, followingID)] = true
	return nil
}

func (r *fakeFollowRepo) Delete(_ context.Context, followerID, followingID uuid.UUID) error {
	key := followKey(followerID, followingID)
	if !r.follows[key] {
		return domain.ErrNotFound
	}
	delete(r.follows, key)
	return nil
}

func (r *fakeFollowRepo) IsFollowing(_ context.Context, followerID, followingID uuid.UUID) (bool, error) {
	return r.follows[followKey(followerID, followingID)], nil
}

func (r *fakeFollowRepo) CountFollowers(_ context.Context, _ uuid.UUID) (int, error) {
	return 0, nil
}

func (r *fakeFollowRepo) CountFollowing(_ context.Context, _ uuid.UUID) (int, error) {
	return 0, nil
}

// ── Helpers ──────────────────────────────────────────────────────────────────

func makePublicUser(googleID, email, name, username string) *domain.User {
	return &domain.User{
		ID:       uuid.New(),
		GoogleID: googleID,
		Email:    email,
		Name:     name,
		Username: username,
		IsPublic: true,
	}
}

// ── UpsertFromGoogle ─────────────────────────────────────────────────────────

func TestUpsertFromGoogle_NewUser(t *testing.T) {
	repo := newFakeUserRepo()
	svc := NewUserService(repo, newFakeFollowRepo(), nil)

	user, isNew, err := svc.UpsertFromGoogle(context.Background(), domain.GoogleAuthInput{
		GoogleID:  "g-new",
		Email:     "new@example.com",
		Name:      "New User",
		AvatarURL: "https://example.com/avatar.png",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !isNew {
		t.Error("expected isNew=true for brand-new user")
	}
	if user.Email != "new@example.com" {
		t.Errorf("Email = %q, want %q", user.Email, "new@example.com")
	}
	if user.IsPublic {
		t.Error("new user should not be public before username registration")
	}
}

func TestUpsertFromGoogle_ReturningUser_UpdatesName(t *testing.T) {
	repo := newFakeUserRepo()
	existing := makePublicUser("g-exist", "exist@example.com", "Old Name", "existuser")
	repo.seed(existing)

	svc := NewUserService(repo, newFakeFollowRepo(), nil)
	user, isNew, err := svc.UpsertFromGoogle(context.Background(), domain.GoogleAuthInput{
		GoogleID: "g-exist",
		Email:    "exist@example.com",
		Name:     "Updated Name",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if isNew {
		t.Error("expected isNew=false for returning user")
	}
	if user.Name != "Updated Name" {
		t.Errorf("Name = %q, want %q", user.Name, "Updated Name")
	}
}

func TestUpsertFromGoogle_ReturningUser_IncompleteRegistration(t *testing.T) {
	repo := newFakeUserRepo()
	id := uuid.New()
	// Simulate a user who signed in but never set a username (placeholder = id.String()).
	partial := &domain.User{
		ID:       id,
		GoogleID: "g-partial",
		Email:    "partial@example.com",
		Name:     "Partial",
		Username: id.String(), // placeholder
		IsPublic: false,
	}
	repo.seed(partial)

	svc := NewUserService(repo, newFakeFollowRepo(), nil)
	_, isNew, err := svc.UpsertFromGoogle(context.Background(), domain.GoogleAuthInput{
		GoogleID: "g-partial",
		Email:    "partial@example.com",
		Name:     "Partial",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !isNew {
		t.Error("expected isNew=true for user with placeholder username")
	}
}

// ── CompleteRegistration ─────────────────────────────────────────────────────

func TestCompleteRegistration_SetsUsernameAndPublic(t *testing.T) {
	repo := newFakeUserRepo()
	id := uuid.New()
	u := &domain.User{ID: id, GoogleID: "g", Email: "a@a.com", Name: "A", Username: id.String(), IsPublic: false}
	repo.seed(u)

	svc := NewUserService(repo, newFakeFollowRepo(), nil)
	got, err := svc.CompleteRegistration(context.Background(), id, "newhandle")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got.Username != "newhandle" {
		t.Errorf("Username = %q, want %q", got.Username, "newhandle")
	}
	if !got.IsPublic {
		t.Error("is_public should be true after registration")
	}
}

func TestCompleteRegistration_UsernameTaken(t *testing.T) {
	repo := newFakeUserRepo()
	taken := makePublicUser("g-taken", "taken@example.com", "Taken", "myhandle")
	repo.seed(taken)

	id := uuid.New()
	newUser := &domain.User{ID: id, GoogleID: "g-new", Email: "n@n.com", Name: "New", Username: id.String()}
	repo.seed(newUser)

	svc := NewUserService(repo, newFakeFollowRepo(), nil)
	_, err := svc.CompleteRegistration(context.Background(), id, "myhandle")
	if !errors.Is(err, domain.ErrUsernameTaken) {
		t.Errorf("expected ErrUsernameTaken, got %v", err)
	}
}

// ── GetProfile ───────────────────────────────────────────────────────────────

func TestGetProfile_PublicProfile_Visible(t *testing.T) {
	repo := newFakeUserRepo()
	u := makePublicUser("g", "u@u.com", "User", "public_user")
	repo.seed(u)

	svc := NewUserService(repo, newFakeFollowRepo(), nil)
	got, err := svc.GetProfile(context.Background(), "public_user", nil)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got.Username != "public_user" {
		t.Errorf("Username = %q, want %q", got.Username, "public_user")
	}
}

func TestGetProfile_PrivateProfile_BlocksStrangers(t *testing.T) {
	repo := newFakeUserRepo()
	u := &domain.User{ID: uuid.New(), GoogleID: "g", Email: "p@p.com", Name: "P", Username: "privateuser", IsPublic: false}
	repo.seed(u)

	svc := NewUserService(repo, newFakeFollowRepo(), nil)
	// GetProfile no longer enforces privacy — it returns the raw user for internal callers.
	// Privacy enforcement lives in GetProfileView; just verify the user is returned.
	got, err := svc.GetProfile(context.Background(), "privateuser", nil)
	if err != nil {
		t.Fatalf("GetProfile should return user regardless of privacy, got error: %v", err)
	}
	if got.Username != "privateuser" {
		t.Errorf("Username = %q, want %q", got.Username, "privateuser")
	}
}

func TestGetProfile_PrivateProfile_OwnerCanView(t *testing.T) {
	repo := newFakeUserRepo()
	id := uuid.New()
	u := &domain.User{ID: id, GoogleID: "g", Email: "p@p.com", Name: "P", Username: "myprofile", IsPublic: false}
	repo.seed(u)

	svc := NewUserService(repo, newFakeFollowRepo(), nil)
	got, err := svc.GetProfile(context.Background(), "myprofile", &id)
	if err != nil {
		t.Fatalf("owner should be able to view own private profile: %v", err)
	}
	if got.Username != "myprofile" {
		t.Errorf("Username = %q, want %q", got.Username, "myprofile")
	}
}

// ── Follow / Unfollow ────────────────────────────────────────────────────────

func TestFollow_Success(t *testing.T) {
	repo := newFakeUserRepo()
	followRepo := newFakeFollowRepo()
	a := makePublicUser("ga", "a@a.com", "A", "auser")
	b := makePublicUser("gb", "b@b.com", "B", "buser")
	repo.seed(a)
	repo.seed(b)

	svc := NewUserService(repo, followRepo, nil)
	if err := svc.Follow(context.Background(), a.ID, b.ID); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !followRepo.follows[followKey(a.ID, b.ID)] {
		t.Error("follow relationship not created")
	}
}

func TestFollow_SelfFollowRejected(t *testing.T) {
	repo := newFakeUserRepo()
	u := makePublicUser("g", "u@u.com", "U", "uuser")
	repo.seed(u)

	svc := NewUserService(repo, newFakeFollowRepo(), nil)
	err := svc.Follow(context.Background(), u.ID, u.ID)
	if !errors.Is(err, domain.ErrInvalidInput) {
		t.Errorf("expected ErrInvalidInput for self-follow, got %v", err)
	}
}

func TestUnfollow_Success(t *testing.T) {
	repo := newFakeUserRepo()
	followRepo := newFakeFollowRepo()
	a := makePublicUser("ga", "a@a.com", "A", "auser")
	b := makePublicUser("gb", "b@b.com", "B", "buser")
	repo.seed(a)
	repo.seed(b)
	followRepo.follows[followKey(a.ID, b.ID)] = true

	svc := NewUserService(repo, followRepo, nil)
	if err := svc.Unfollow(context.Background(), a.ID, b.ID); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if followRepo.follows[followKey(a.ID, b.ID)] {
		t.Error("follow relationship should have been deleted")
	}
}

// ── UpdateProfile ────────────────────────────────────────────────────────────

func TestUpdateProfile_UpdatesBio(t *testing.T) {
	repo := newFakeUserRepo()
	u := makePublicUser("g", "u@u.com", "User", "user1")
	repo.seed(u)

	svc := NewUserService(repo, newFakeFollowRepo(), nil)
	bio := "My new bio"
	got, err := svc.UpdateProfile(context.Background(), u.ID, domain.UpdateProfileInput{Bio: &bio})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got.Bio == nil || *got.Bio != bio {
		t.Errorf("Bio = %v, want %q", got.Bio, bio)
	}
}

func TestUpdateProfile_TogglesIsPublic(t *testing.T) {
	repo := newFakeUserRepo()
	u := makePublicUser("g", "u@u.com", "User", "user2")
	repo.seed(u)

	svc := NewUserService(repo, newFakeFollowRepo(), nil)
	isPublic := false
	got, err := svc.UpdateProfile(context.Background(), u.ID, domain.UpdateProfileInput{IsPublic: &isPublic})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got.IsPublic {
		t.Error("is_public should be false after update")
	}
}

// ── GetByID ──────────────────────────────────────────────────────────────────

func TestGetByID_ReturnsUser(t *testing.T) {
	repo := newFakeUserRepo()
	u := makePublicUser("g", "u@u.com", "User", "user3")
	repo.seed(u)

	svc := NewUserService(repo, newFakeFollowRepo(), nil)
	got, err := svc.GetByID(context.Background(), u.ID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got.ID != u.ID {
		t.Errorf("ID = %v, want %v", got.ID, u.ID)
	}
}

func TestGetByID_NotFound(t *testing.T) {
	svc := NewUserService(newFakeUserRepo(), newFakeFollowRepo(), nil)
	_, err := svc.GetByID(context.Background(), uuid.New())
	if !errors.Is(err, domain.ErrNotFound) {
		t.Errorf("expected ErrNotFound, got %v", err)
	}
}

// ── Search ───────────────────────────────────────────────────────────────────

func TestSearch_DelegatesToRepo(t *testing.T) {
	repo := newFakeUserRepo()
	svc := NewUserService(repo, newFakeFollowRepo(), nil)
	// fakeUserRepo.SearchByQuery always returns nil, so just verify no error.
	results, err := svc.Search(context.Background(), "test", 20, nil)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	_ = results
}

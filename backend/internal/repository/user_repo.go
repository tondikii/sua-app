package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

type userRepo struct {
	db *pgxpool.Pool
}

// NewUserRepository returns a PostgreSQL-backed implementation of domain.UserRepository.
func NewUserRepository(db *pgxpool.Pool) domain.UserRepository {
	return &userRepo{db: db}
}

func (r *userRepo) Create(ctx context.Context, user *domain.User) error {
	const query = `
		INSERT INTO users (id, google_id, email, name, username, avatar_url, bio, is_public)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
	_, err := r.db.Exec(ctx, query,
		user.ID, user.GoogleID, user.Email, user.Name,
		user.Username, user.AvatarURL, user.Bio, user.IsPublic,
	)
	return mapPgError(err)
}

func (r *userRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	const query = `
		SELECT id, google_id, email, name, username, avatar_url, bio, is_public, created_at, updated_at
		FROM users WHERE id = $1`
	return scanUser(r.db.QueryRow(ctx, query, id))
}

func (r *userRepo) FindByGoogleID(ctx context.Context, googleID string) (*domain.User, error) {
	const query = `
		SELECT id, google_id, email, name, username, avatar_url, bio, is_public, created_at, updated_at
		FROM users WHERE google_id = $1`
	return scanUser(r.db.QueryRow(ctx, query, googleID))
}

func (r *userRepo) FindByUsername(ctx context.Context, username string) (*domain.User, error) {
	const query = `
		SELECT id, google_id, email, name, username, avatar_url, bio, is_public, created_at, updated_at
		FROM users WHERE username = $1`
	return scanUser(r.db.QueryRow(ctx, query, username))
}

func (r *userRepo) Update(ctx context.Context, user *domain.User) error {
	const query = `
		UPDATE users
		SET name = $1, username = $2, avatar_url = $3, bio = $4, is_public = $5
		WHERE id = $6`
	tag, err := r.db.Exec(ctx, query,
		user.Name, user.Username, user.AvatarURL, user.Bio, user.IsPublic, user.ID,
	)
	if err != nil {
		return mapPgError(err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *userRepo) IsUsernameTaken(ctx context.Context, username string) (bool, error) {
	var exists bool
	err := r.db.QueryRow(ctx,
		`SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)`, username,
	).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("user_repo: IsUsernameTaken: %w", err)
	}
	return exists, nil
}

// SearchByQuery performs a case-insensitive trigram search across username and name.
// Only public profiles are returned. cursor is reserved for future keyset pagination.
func (r *userRepo) SearchByQuery(ctx context.Context, query string, limit int, _ *uuid.UUID) ([]*domain.User, error) {
	const sql = `
		SELECT id, google_id, email, name, username, avatar_url, bio, is_public, created_at, updated_at
		FROM users
		WHERE is_public = true
		  AND (username ILIKE '%' || $1 || '%' OR name ILIKE '%' || $1 || '%')
		ORDER BY username ASC
		LIMIT $2`
	rows, err := r.db.Query(ctx, sql, query, limit)
	if err != nil {
		return nil, fmt.Errorf("user_repo: SearchByQuery: %w", err)
	}
	defer rows.Close()

	var users []*domain.User
	for rows.Next() {
		u, err := scanUser(rows)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, rows.Err()
}

// ── helpers ───────────────────────────────────────────────────────────────────

// rowScanner is satisfied by both pgx.Row and pgx.Rows.
type rowScanner interface {
	Scan(dest ...any) error
}

func scanUser(row rowScanner) (*domain.User, error) {
	var u domain.User
	err := row.Scan(
		&u.ID, &u.GoogleID, &u.Email, &u.Name,
		&u.Username, &u.AvatarURL, &u.Bio, &u.IsPublic,
		&u.CreatedAt, &u.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, domain.ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("user_repo: scan: %w", err)
	}
	return &u, nil
}

// mapPgError translates PostgreSQL wire errors to domain sentinel errors.
func mapPgError(err error) error {
	if err == nil {
		return nil
	}
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		switch pgErr.Code {
		case "23505": // unique_violation
			if pgErr.ConstraintName == "users_username_key" {
				return domain.ErrUsernameTaken
			}
			return domain.ErrConflict
		}
	}
	return fmt.Errorf("user_repo: %w", err)
}

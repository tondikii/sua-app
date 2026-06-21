package repository

import (
    "context"
    "encoding/json"
    "fmt"

    "github.com/google/uuid"
    "github.com/jackc/pgx/v5/pgxpool"

    "github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

type wishlistRepo struct {
    db *pgxpool.Pool
}

// NewWishlistRepository returns a PostgreSQL-backed implementation of domain.WishlistRepository.
func NewWishlistRepository(db *pgxpool.Pool) domain.WishlistRepository {
    return &wishlistRepo{db: db}
}

func (r *wishlistRepo) Create(ctx context.Context, item *domain.Wishlist) error {
    const query = `
INSERT INTO wishlists (id, user_id, place_name, link, tags, priority_level)
VALUES ($1, $2, $3, $4, $5, $6)`
    tagsJSON, err := json.Marshal(item.Tags)
    if err != nil {
        return fmt.Errorf("wishlist_repo: marshal tags: %w", err)
    }
    _, err = r.db.Exec(ctx, query, item.ID, item.UserID, item.PlaceName, item.Link, tagsJSON, item.PriorityLevel)
    if err != nil {
        return fmt.Errorf("wishlist_repo: create: %w", err)
    }
    return nil
}

func (r *wishlistRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.Wishlist, error) {
    const query = `
SELECT id, user_id, place_name, link, tags, priority_level, deleted_at, created_at, updated_at
FROM wishlists WHERE id = $1`
    row := r.db.QueryRow(ctx, query, id)
    var w domain.Wishlist
    var tagsJSON []byte
    var priority string
    if err := row.Scan(&w.ID, &w.UserID, &w.PlaceName, &w.Link, &tagsJSON, &priority, &w.DeletedAt, &w.CreatedAt, &w.UpdatedAt); err != nil {
        return nil, fmt.Errorf("wishlist_repo: find by id: %w", err)
    }
    if err := json.Unmarshal(tagsJSON, &w.Tags); err != nil {
        return nil, fmt.Errorf("wishlist_repo: unmarshal tags: %w", err)
    }
    w.PriorityLevel = domain.PriorityLevel(priority)
    return &w, nil
}

func (r *wishlistRepo) List(ctx context.Context, userID uuid.UUID, filter domain.WishlistFilter) ([]*domain.Wishlist, error) {
    args := []any{userID}
    query := `SELECT id, user_id, place_name, link, tags, priority_level, deleted_at, created_at, updated_at FROM wishlists WHERE user_id = $1 AND deleted_at IS NULL`

    idx := 2
    if filter.Priority != nil {
        query += fmt.Sprintf(" AND priority_level = $%d", idx)
        args = append(args, *filter.Priority)
        idx++
    }
    if len(filter.Tags) > 0 {
        tagsJSON, _ := json.Marshal(filter.Tags)
        query += fmt.Sprintf(" AND tags @> $%d::jsonb", idx)
        args = append(args, tagsJSON)
        idx++
    }

    // Keyset pagination by (created_at, id) using the cursor id when provided.
    if filter.Cursor != nil {
        // fetch created_at of cursor
        var cursorCreated any
        if err := r.db.QueryRow(ctx, `SELECT created_at FROM wishlists WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`, *filter.Cursor, userID).Scan(&cursorCreated); err == nil {
            query += fmt.Sprintf(" AND (created_at, id) < ($%d, $%d)", idx, idx+1)
            args = append(args, cursorCreated, *filter.Cursor)
            idx += 2
        }
    }

    limit := filter.Limit
    if limit <= 0 {
        limit = 20
    }
    if limit > 100 {
        limit = 100
    }
    query += fmt.Sprintf(" ORDER BY created_at DESC, id DESC LIMIT $%d", idx)
    args = append(args, limit)

    rows, err := r.db.Query(ctx, query, args...)
    if err != nil {
        return nil, fmt.Errorf("wishlist_repo: list: %w", err)
    }
    defer rows.Close()

    var out []*domain.Wishlist
    for rows.Next() {
        var w domain.Wishlist
        var tagsJSON []byte
        var priority string
        if err := rows.Scan(&w.ID, &w.UserID, &w.PlaceName, &w.Link, &tagsJSON, &priority, &w.DeletedAt, &w.CreatedAt, &w.UpdatedAt); err != nil {
            return nil, fmt.Errorf("wishlist_repo: scan: %w", err)
        }
        if err := json.Unmarshal(tagsJSON, &w.Tags); err != nil {
            return nil, fmt.Errorf("wishlist_repo: unmarshal tags: %w", err)
        }
        w.PriorityLevel = domain.PriorityLevel(priority)
        out = append(out, &w)
    }
    return out, rows.Err()
}

func (r *wishlistRepo) Update(ctx context.Context, item *domain.Wishlist) error {
    const query = `
UPDATE wishlists SET place_name = $1, link = $2, tags = $3, priority_level = $4, updated_at = NOW() WHERE id = $5 AND user_id = $6 AND deleted_at IS NULL`
    tagsJSON, err := json.Marshal(item.Tags)
    if err != nil {
        return fmt.Errorf("wishlist_repo: marshal tags: %w", err)
    }
    tag, err := r.db.Exec(ctx, query, item.PlaceName, item.Link, tagsJSON, item.PriorityLevel, item.ID, item.UserID)
    if err != nil {
        return fmt.Errorf("wishlist_repo: update: %w", err)
    }
    if tag.RowsAffected() == 0 {
        return domain.ErrNotFound
    }
    return nil
}

func (r *wishlistRepo) SoftDelete(ctx context.Context, id, userID uuid.UUID) error {
    tag, err := r.db.Exec(ctx, `UPDATE wishlists SET deleted_at = NOW() WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`, id, userID)
    if err != nil {
        return fmt.Errorf("wishlist_repo: soft delete: %w", err)
    }
    if tag.RowsAffected() == 0 {
        return domain.ErrNotFound
    }
    return nil
}

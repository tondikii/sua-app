# ============================================================
#  Atur Perjalanan — Makefile
#
#  Requires:
#    GNU make  — Git Bash (Windows), WSL2, or:
#                choco install make   (Chocolatey)
#                scoop install make   (Scoop)
#    Docker Desktop
#    Go 1.23+
#    golang-migrate CLI  https://github.com/golang-migrate/migrate/tree/master/cmd/migrate
#
#  Quick start:
#    1. cp .env.example .env && cp .env.example backend/.env
#    2. Edit both .env files with real secrets
#    3. make up
#    4. make migrate-up
#    5. make run
# ============================================================

.PHONY: help up down logs ps \
        migrate-up migrate-down migrate-create \
        build run test lint tidy

# Load root .env so DATABASE_URL is available for migrate-* targets.
# Variables with spaces or special chars in .env may need quoting.
-include .env
export

# ── Docker ───────────────────────────────────────────────────────────────────

up: ## Start PostgreSQL container in the background
	docker compose up -d
	@echo ""
	@echo "PostgreSQL starting on port $(DB_HOST_PORT). Wait ~5 s, then run: make migrate-up"

down: ## Stop and remove containers (data volume is preserved)
	docker compose down

logs: ## Tail PostgreSQL container logs
	docker compose logs -f postgres

ps: ## Show running containers
	docker compose ps

# ── Database Migrations ──────────────────────────────────────────────────────

migrate-up: ## Apply all pending migrations
	migrate -path backend/migrations -database "$(DATABASE_URL)" up

migrate-down: ## Roll back the most recent applied migration
	migrate -path backend/migrations -database "$(DATABASE_URL)" down 1

migrate-create: ## Scaffold a new migration pair  →  make migrate-create name=add_notifications
	migrate create -ext sql -dir backend/migrations -seq $(name)

# ── Backend ──────────────────────────────────────────────────────────────────

build: ## Compile the backend binary → backend/bin/api
	cd backend && go build -o bin/api ./cmd/api

run: ## Run the Go backend server (reads backend/.env)
	cd backend && go run ./cmd/api

test: ## Run all backend tests with the race detector
	cd backend && go test -race -cover ./...

lint: ## Run go vet across all packages
	cd backend && go vet ./...

tidy: ## Tidy and verify Go module dependencies
	cd backend && go mod tidy && go mod verify

# ── Help ─────────────────────────────────────────────────────────────────────

help: ## Print this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

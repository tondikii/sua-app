package config

import (
	"log/slog"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all runtime configuration loaded from environment variables.
type Config struct {
	DatabaseURL         string
	JWTSecret           string
	GoogleClientID      string
	GoogleCalendarSAKey string
	Port                string
	AppEnv              string
}

// Load reads environment variables and an optional .env file into a Config.
// The application exits immediately if a required variable is missing.
func Load() *Config {
	if err := godotenv.Load(); err != nil {
		slog.Warn(".env file not found; relying on process environment variables")
	}

	return &Config{
		DatabaseURL:         requireEnv("DATABASE_URL"),
		JWTSecret:           requireEnv("JWT_SECRET"),
		GoogleClientID:      requireEnv("GOOGLE_CLIENT_ID"),
		GoogleCalendarSAKey: os.Getenv("GOOGLE_CALENDAR_SA_KEY"),
		Port:                envWithDefault("PORT", "8080"),
		AppEnv:              envWithDefault("APP_ENV", "development"),
	}
}

func requireEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		slog.Error("required environment variable is not set", "key", key)
		os.Exit(1)
	}
	return v
}

func envWithDefault(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

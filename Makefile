# Variables
SERVER_DIR = server
MOBILE_DIR = mobile

.PHONY: help server mobile all

help:
	@echo "Usage: make <target>"
	@echo "Targets:"
	@echo "  server    Run the Go backend"
	@echo "  mobile    Run the KMP mobile app (Android)"
	@echo "  all       Run both sequentially"

server:
	@echo "[SUA] Starting Go Server..."
	cd $(SERVER_DIR) && go run main.go

mobile:
	@echo "[SUA] Starting KMP Mobile App..."
	cd $(MOBILE_DIR) && ./gradlew :composeApp:run

all: server mobile
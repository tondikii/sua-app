#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Build APK development (expo-dev-client) secara LOKAL via EAS Build.
#
#   EAS Build lokal = prebuild + Gradle build di mesin sendiri (bukan cloud),
#   hasilnya APK yang bisa di-install ke device/emulator.
#
# Penggunaan:
#   ./scripts/build-android-dev-local.sh            # pakai .env (default)
#   ./scripts/build-android-dev-local.sh develop    # pakai .env.development
#
# Env yang dipakai disalin ke .env sementara selama build, lalu dikembalikan.
# Isi EXPO_PUBLIC_API_URL di .env.development dengan IP LAN mesin (bukan
# localhost) agar device fisik bisa menjangkau backend, contoh:
#   EXPO_PUBLIC_API_URL=http://192.168.1.10:8080/v1
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

cd "$(dirname "$0")/.."

ENV_NAME="${1:-}"
ENV_FILE=".env"
if [[ -n "$ENV_NAME" ]]; then
  ENV_FILE=".env.$ENV_NAME"
  if [[ ! -f "$ENV_FILE" ]]; then
    echo "❌ Env file '$ENV_FILE' tidak ditemukan di $(pwd)." >&2
    echo "   Buat dari template: cp .env.example .env.$ENV_NAME" >&2
    exit 1
  fi
fi

OUT_DIR="dist/android-dev"
mkdir -p "$OUT_DIR"

echo "── EAS Build Android (dev, local) ──────────────────────────────"
echo "  Profile : development (expo-dev-client, APK)"
echo "  Env     : $ENV_FILE"
echo "  Output  : $OUT_DIR/"
echo "────────────────────────────────────────────────────────────────"

# EAS Build membaca .env dari direktori project. Pastikan env target aktif.
if [[ "$ENV_FILE" != ".env" ]]; then
  cp .env "$OUT_DIR/.env.backup" 2>/dev/null || true
  cp "$ENV_FILE" .env
  echo "✔ Pakai $ENV_FILE untuk build ini (.env asli disimpan di $OUT_DIR/.env.backup)"
fi

trap 'restore_env' EXIT
restore_env() {
  if [[ -f "$OUT_DIR/.env.backup" ]]; then
    mv "$OUT_DIR/.env.backup" .env
    echo "✔ .env asli dikembalikan."
  fi
}

# Jalankan EAS build lokal. --local = build di mesin (prebuild + Gradle).
# --output menentukan path APK yang dihasilkan.
if command -v eas >/dev/null 2>&1; then
  EAS="eas"
else
  EAS="npx eas-cli"
fi

"$EAS" build \
  --platform android \
  --profile development \
  --local \
  --output "$OUT_DIR/"

echo ""
echo "✅ Build selesai. APK ada di: $OUT_DIR/"
echo "   Install ke device: adb install $OUT_DIR/*.apk"

#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME=${IMAGE_NAME:-ghcr.io/tu_usuario_github/ionos-docker-webinar}
APP_VERSION=${APP_VERSION:-v1.0}

docker pull "$IMAGE_NAME:$APP_VERSION"
docker stop mi-app || true
docker rm mi-app || true

docker run -d \
  -p 80:3000 \
  --name mi-app \
  --restart unless-stopped \
  -e NODE_ENV=production \
  -e APP_VERSION="$APP_VERSION" \
  "$IMAGE_NAME:$APP_VERSION"

docker ps

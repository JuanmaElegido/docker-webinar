#!/usr/bin/env bash
set -euo pipefail

cd /opt/docker-webinar/demo3-compose

docker stop mi-app || true
docker rm mi-app || true

docker compose up -d
docker compose ps

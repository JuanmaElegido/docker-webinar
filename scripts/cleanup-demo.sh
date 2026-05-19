#!/usr/bin/env bash
set -euo pipefail

docker stop mi-app || true
docker rm mi-app || true

if [ -d /opt/docker-webinar/demo3-compose ]; then
  cd /opt/docker-webinar/demo3-compose
  docker compose down || true
fi

docker ps -a

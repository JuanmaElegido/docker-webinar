#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/docker-webinar/demo1-manual
sudo mkdir -p /opt/docker-webinar/demo3-compose
sudo mkdir -p /opt/docker-webinar/scripts
sudo chown -R webinar:webinar /opt/docker-webinar

echo "Directorios creados en /opt/docker-webinar"

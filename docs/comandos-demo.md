# Comandos rápidos para la demo

## Local

```bash
docker build -t mi-app:v1.0 .
docker run -d -p 3000:3000 --name mi-app-local mi-app:v1.0
curl http://localhost:3000
docker stop mi-app-local && docker rm mi-app-local
```

## Push GHCR

```bash
export IMAGE_NAME=ghcr.io/tu_usuario_github/ionos-docker-webinar
docker login ghcr.io
docker tag mi-app:v1.0 $IMAGE_NAME:v1.0
docker push $IMAGE_NAME:v1.0
```

## VPS Demo 1

```bash
docker pull ghcr.io/tu_usuario_github/ionos-docker-webinar:v1.0
docker run -d -p 80:3000 --name mi-app --restart unless-stopped ghcr.io/tu_usuario_github/ionos-docker-webinar:v1.0
docker ps
curl http://localhost
```

## VPS Demo 3

```bash
docker stop mi-app || true
docker rm mi-app || true
cd /opt/docker-webinar/demo3-compose
docker compose up -d
docker compose ps
curl http://localhost/db
```

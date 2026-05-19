# Webinar Docker + IONOS Cloud

Proyecto demo para el webinar **“Docker en la nube: empaqueta, ejecuta y despliega aplicaciones web de forma eficiente”**.

Incluye:

- Aplicación Node.js sencilla con Express.
- Endpoint `/health` para healthchecks.
- Endpoint `/db` para comprobar conexión con PostgreSQL en Docker Compose.
- `Dockerfile` preparado para producción.
- `.dockerignore`.
- Workflow de GitHub Actions para build + push + deploy en VPS de IONOS.
- `docker-compose.yml` con app + PostgreSQL + Nginx.
- Scripts de apoyo para las demos.

---

## Estructura

```text
ionos-docker-webinar/
├── server.js
├── package.json
├── Dockerfile
├── .dockerignore
├── .github/
│   └── workflows/
│       └── deploy.yml
├── compose/
│   ├── docker-compose.yml
│   ├── nginx.conf
│   └── .env.example
├── scripts/
│   ├── prepare-vps-directories.sh
│   ├── demo1-run-manual.sh
│   ├── demo3-compose-up.sh
│   └── cleanup-demo.sh
└── docs/
    └── puertos.md
```

---

## Demo 1: Dockerizar y desplegar manualmente

### 1. Construir la imagen en local

```bash
docker build -t mi-app:v1.0 .
```

### 2. Probar en local

```bash
docker run -d -p 3000:3000 --name mi-app-local mi-app:v1.0
curl http://localhost:3000
curl http://localhost:3000/health
docker stop mi-app-local
docker rm mi-app-local
```

### 3. Subir a GHCR

Cambia `tu_usuario_github` por tu usuario real en minúsculas.

```bash
export IMAGE_NAME=ghcr.io/tu_usuario_github/ionos-docker-webinar

docker login ghcr.io
docker tag mi-app:v1.0 $IMAGE_NAME:v1.0
docker push $IMAGE_NAME:v1.0
```

### 4. Ejecutar en el VPS

```bash
ssh webinar@IP_DEL_VPS

docker login ghcr.io
docker pull ghcr.io/tu_usuario_github/ionos-docker-webinar:v1.0

docker run -d \
  -p 80:3000 \
  --name mi-app \
  --restart unless-stopped \
  -e NODE_ENV=production \
  -e APP_VERSION=v1.0 \
  ghcr.io/tu_usuario_github/ionos-docker-webinar:v1.0
```

Comprueba:

```bash
docker ps
curl http://localhost
```

En navegador:

```text
http://IP_DEL_VPS
```

---

## Demo 2: CI/CD con GitHub Actions

El workflow está en:

```text
.github/workflows/deploy.yml
```

### Variables de GitHub Actions

En **Settings → Secrets and variables → Actions → Variables**:

```text
IMAGE_NAME=ghcr.io/tu_usuario_github/ionos-docker-webinar
```

### Secrets de GitHub Actions

En **Settings → Secrets and variables → Actions → Secrets**:

```text
VPS_HOST=IP_DEL_VPS
SSH_KEY=clave_privada_ssh_para_usuario_webinar
GHCR_USER=tu_usuario_github
GHCR_TOKEN=token_de_github_con_permiso_packages
```

### Demo en directo

Cambia el mensaje en `server.js`, por ejemplo:

```js
message: process.env.MESSAGE || "Hola desde Docker en IONOS v2.0 🚀",
```

Después:

```bash
git add server.js
git commit -m "Update greeting message to v2.0"
git push origin main
```

Abre GitHub Actions y muestra el pipeline.

---

## Demo 3: Docker Compose con app + PostgreSQL + Nginx

Antes de Demo 3, libera el puerto 80 si la Demo 1/2 sigue corriendo:

```bash
docker stop mi-app || true
docker rm mi-app || true
```

### 1. Preparar directorio en el VPS

```bash
sudo mkdir -p /opt/docker-webinar/demo3-compose
sudo chown -R webinar:webinar /opt/docker-webinar
```

### 2. Copiar archivos al VPS

Desde tu máquina local:

```bash
scp compose/docker-compose.yml webinar@IP_DEL_VPS:/opt/docker-webinar/demo3-compose/
scp compose/nginx.conf webinar@IP_DEL_VPS:/opt/docker-webinar/demo3-compose/
scp compose/.env.example webinar@IP_DEL_VPS:/opt/docker-webinar/demo3-compose/.env
```

### 3. Editar `.env` en el VPS

```bash
ssh webinar@IP_DEL_VPS
nano /opt/docker-webinar/demo3-compose/.env
```

Ejemplo:

```env
IMAGE_NAME=ghcr.io/tu_usuario_github/ionos-docker-webinar
APP_VERSION=v1.0
POSTGRES_PASSWORD=DemoPass123
```

### 4. Levantar stack

```bash
cd /opt/docker-webinar/demo3-compose
docker compose up -d
docker compose ps
```

### 5. Probar

```bash
curl http://localhost
curl http://localhost/health
curl http://localhost/db
```

En navegador:

```text
http://IP_DEL_VPS
http://IP_DEL_VPS/health
http://IP_DEL_VPS/db
```

---

## Comandos de emergencia

```bash
docker ps -a
docker logs -f mi-app
docker stop mi-app || true
docker rm mi-app || true
```

```bash
cd /opt/docker-webinar/demo3-compose
docker compose ps
docker compose logs -f
docker compose down
docker compose up -d
```

---

## Puertos

Abrir públicamente:

```text
22/tcp   SSH
80/tcp   HTTP
443/tcp  HTTPS
```

No abrir al exterior:

```text
3000/tcp  App Node.js
5432/tcp  PostgreSQL
```

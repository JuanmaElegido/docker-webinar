# Puertos para el webinar

Abrir públicamente en el VPS:

- 22/tcp: SSH
- 80/tcp: HTTP
- 443/tcp: HTTPS

No abrir al exterior:

- 3000/tcp: app Node.js, solo interno o mapeado desde 80
- 5432/tcp: PostgreSQL, solo red interna de Docker

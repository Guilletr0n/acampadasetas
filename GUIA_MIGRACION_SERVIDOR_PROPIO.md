# Guía de Arquitectura de Backend y Migración a Servidor Propio
## Proyecto: Acampada Setas (acampadasetas.org)

Este documento describe la arquitectura interna del backend del proyecto, sus dependencias actuales con Google Cloud Platform (GCP) y las instrucciones técnicas detalladas para que un desarrollador de sistemas / DevOps pueda migrar toda la infraestructura a un servidor propio (VPS / On-Premise) de forma que el desarrollador frontend solo tenga que seguir haciendo `git push` a GitHub.

---

## 1. Resumen Ejecutivo del Backend

La aplicación no es un sitio web estático tradicional: es una aplicación **Server-Side Rendered (SSR) construida sobre Astro 5 (Node.js)** en modo autónomo (`standalone`).

- **Runtime:** Node.js `>=22.12.0` (adaptador `@astrojs/node` en modo standalone).
- **Contenedor:** Ya cuenta con un `Dockerfile` optimizado en múltiples etapas (`node:22-alpine`).
- **Servidor Web Interno:** Escucha peticiones HTTP en el puerto `8080` (configurable mediante `PORT`).
- **Rutas Dinámicas y APIs:** Todo el renderizado de la portada, galería, administración y los endpoints REST (`/api/*`) se procesan en el servidor en cada petición (`prerender = false`).

### Las 3 Dependencias Actuales de Google Cloud
En la infraestructura actual en GCP, la aplicación depende de:
1. **Google Cloud Run:** Ejecución del contenedor Docker como servicio serverless en las regiones de Madrid (`europe-southwest1`) y Bélgica (`europe-west1`).
2. **Google Cloud Firestore:** Base de datos NoSQL de documentos para el contenido, historial, agenda y usuarios.
3. **Google Cloud Storage (GCS):** Almacenamiento en bucket (`acampadasetas-media`) para fotografías y cartelería en formato WebP optimizado.

### 💡 Gran ventaja de la base de código actual:
El código fuente en `src/lib/` (**`db.ts`**, **`storage.ts`**, **`users.ts`**) fue programado con un **patrón de fallback desacoplado**: si el servidor no detecta credenciales de Google, **el sistema conmuta automáticamente a almacenamiento local persistente en `.data/`**, sirviendo los archivos multimedia a través del endpoint `/api/media/[filename]`. 

Esto significa que **la aplicación puede funcionar al 100% en un servidor propio de forma inmediata**, sin necesidad de pagar ningún servicio de Google.

---

## 2. Modelos de Datos y Estructura del Backend

El backend gestiona cuatro dominios principales que actualmente se almacenan en Firestore (o en `.data/*.json` en modo local):

```
                                  ┌────────────────────────┐
                                  │   Astro SSR (Node.js)  │
                                  │   (Puerto 8080/HTTP)   │
                                  └───────────┬────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
            ┌───────────────┐         ┌───────────────┐         ┌───────────────┐
            │   Usuarios    │         │  Contenidos   │         │  Multimedia   │
            │     & Auth    │         │   & Agenda    │         │  (Uploads)    │
            └───────┬───────┘         └───────┬───────┘         └───────┬───────┘
                    │                         │                         │
      (Roles: admin/editor/reader)    (Secciones, Historial,    (Sharp: WebP <5MB)
                    │                  Galería, Actividades)            │
                    ▼                         ▼                         ▼
             Firestore / .data/        Firestore / .data/        GCS / .data/uploads/
```

### 2.1. Gestión de Contenidos (CMS y Secciones de la Home)
- **Colección:** `sections`
  - Campos: `id` (string), `slug` (string), `order` (number), `updatedAt` (ISO string).
  - Objeto `draft` (borrador en edición): `title`, `navLabel`, `subtitle`, `highlight`, `template` (p. ej. `single-column`, `multi-column`, `schedule`, `fondo-carmin`), `body` (Markdown), `illustrationUrl`.
  - Objeto `live` (lo publicado visible al público general): idéntica estructura que `draft`.
- **Subcolección / Historial:** `sections/{sectionId}/history`
  - Auditoría y copias de seguridad de cada cambio guardado o publicado, con `timestamp`, `authorName` y copia íntegra del contenido para permitir rollbacks desde el panel de administración.
- **Endpoints:**
  - `GET /api/admin/sections`: Consulta de secciones y borradores.
  - `POST /api/admin/sections`: Acciones `save-draft`, `publish`, `restore` y `delete`.

### 2.2. Agenda y Programa de Actividades
- **Colección:** `activities`
  - Campos: `id`, `time` (ej. "18:00"), `title`, `description`, `status` (`published` | `draft`), `order`, `createdAt`, `updatedAt`.
- **Lógica de reseteo nocturno (Madrid Midnight Rollover):**
  - La aplicación cuenta con una regla de negocio: **a las 00:00 hora peninsular (Europe/Madrid)**, cualquier actividad publicada de días anteriores pasa automáticamente a estado `draft`.
  - Esto se ejecuta tanto en la función `getActivities()` como mediante un `setInterval` en memoria cada 5 minutos dentro del proceso de Node.js.
- **Endpoints:**
  - `GET /api/admin/activities`: Lista de actividades.
  - `POST /api/admin/activities`: Acciones `add`, `edit`, `status` y `delete-bulk`.

### 2.3. Galería Fotográfica
- **Colección:** `gallery`
  - Campos: `id`, `url`, `caption`, `author`, `social`, `order`, `createdAt`.
- **Endpoints:**
  - `GET /api/admin/gallery` o carga directa en `/gallery.astro`.
  - `POST /api/admin/gallery` (creación y actualización).
  - `DELETE /api/admin/gallery`.

### 2.4. Gestión de Usuarios y Autenticación (RBAC)
- **Colección:** `users`
  - Campos: `uid`, `email`, `displayName`, `role` (`admin` | `editor` | `reader`), `approved` (boolean), `password` (string), `createdAt`, `updatedAt`.
- **Flujo de Autenticación:**
  1. Login: `POST /api/auth/login` valida credenciales y genera una cookie HTTP-only segura llamada `as_session_user`.
  2. Registro público: `POST /api/auth/register` crea cuentas en estado `reader` y `approved: false`.
  3. Aprobación: Un `admin` debe entrar en `/admin/users` para aprobar al usuario y asignarle rol `editor` o `admin`.
  4. Middleware (`src/middleware.ts`): Intercepta cualquier ruta que comience por `/admin/*`, redirige a `/login` si no hay sesión, o a `/pending-approval` si no está aprobado.
  5. Logout: `POST /api/auth/logout` limpia la cookie.

### 2.5. Archivos Multimedia
- **Procesamiento:** `POST /api/upload` valida que el archivo no supere 5 MB y utiliza la librería `sharp` para convertir la imagen a formato WebP (calidad 85).
- **Almacenamiento:**
  - En Google: se envía a Google Cloud Storage (`images/{uuid}.webp`).
  - En Local / Servidor propio: se almacena en el sistema de archivos en `.data/uploads/{uuid}.webp`.
  - La ruta `/api/media/[filename]` sirve las imágenes con cabeceras `Cache-Control: public, max-age=31536000, immutable`.

---

## 3. Estrategias de Migración para el Administrador de Sistemas

El administrador de sistemas puede optar por dos vías para sustituir los servicios de Google:

### Opción 1: Despliegue Inmediato usando Almacenamiento Persistente en Disco (Recomendado para empezar)
Dado que el código **ya contiene toda la lógica de persistencia en `.data/`**, no se requiere modificar el código fuente de Node.js:
- La base de datos se guarda en archivos JSON sincronizados de forma atómica en `/app/.data/`.
- Las imágenes subidas se guardan en `/app/.data/uploads/`.
- **Solo se necesita montar un volumen persistente de Docker** para que los datos sobrevivan a los reinicios y despliegues del contenedor.

### Opción 2: Base de Datos Dedicada y Almacenamiento Compatible S3
Si el equipo de sistemas prefiere una base de datos estándar de producción (PostgreSQL, MariaDB, SQLite o MongoDB) y almacenamiento compatible S3 (MinIO):
- **Base de Datos:** Se reemplazarían las llamadas en `src/lib/db.ts` y `src/lib/users.ts` por consultas a PostgreSQL (usando Drizzle ORM, Kysely o Prisma) o a una base SQLite en volumen persistente.
- **Storage Multimedia:** En `src/lib/storage.ts`, cambiar el cliente `@google-cloud/storage` por `@aws-sdk/client-s3` apuntando a un bucket MinIO autohospedado o un servicio S3 compatible (ej. Cloudflare R2, Scaleway, Wasabi).

---

## 4. Requisitos de Infraestructura del Servidor Propio

Para alojar la aplicación sin dependencias de Google se requiere:

### 4.1. Hardware Mínimo Recomendado
- **CPU:** 1 vCPU (2 vCPUs recomendadas para procesado rápido de imágenes con `sharp`).
- **RAM:** 1 GB mínimo (2 GB recomendados).
- **Disco:** 20–40 GB SSD (según el volumen de fotografías en la galería).
- **Sistema Operativo:** Ubuntu 22.04 / 24.04 LTS o Debian 12.

### 4.2. Pila de Software
- **Docker Engine** `>=26.0` y **Docker Compose** plugin v2.
- **Reverse Proxy con HTTPS:** Caddy, Nginx Proxy Manager o Traefik (para emisión y renovación automática de certificados SSL con Let's Encrypt).
- **Git** y un usuario de despliegue con acceso SSH por clave pública.

---

## 5. Configuración Lista para Producción (Docker & Compose)

A continuación se detalla la configuración lista para montar en el servidor.

### 5.1. Estructura de Directorios en el Servidor
```text
/opt/acampadasetas/
├── docker-compose.yml
├── .env.production
└── data/                   <-- Volumen persistente donde se guardan JSONs e imágenes
    ├── sections.json
    ├── history.json
    ├── activities.json
    ├── gallery.json
    ├── users.json
    └── uploads/
```

### 5.2. Archivo `docker-compose.yml`
```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    image: acampadasetas-web:latest
    container_name: acampadasetas_web
    restart: always
    environment:
      - NODE_ENV=production
      - PORT=8080
      - HOST=0.0.0.0
      - SITE_URL=https://acampadasetas.org
      - DOMAIN=acampadasetas.org
    volumes:
      # Persistencia de base de datos local y subida de imágenes
      - ./data:/app/.data
    ports:
      - "127.0.0.1:8080:8080"
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:8080/"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 15s

  # Proxy inverso Caddy con HTTPS automático (Let's Encrypt)
  caddy:
    image: caddy:2-alpine
    container_name: acampadasetas_caddy
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - web

volumes:
  caddy_data:
  caddy_config:
```

### 5.3. Configuración del Reverse Proxy (`Caddyfile`)
Caddy gestiona automáticamente los certificados SSL sin necesidad de configurar certbot ni cronjobs:

```caddy
acampadasetas.org, www.acampadasetas.org {
    encode zstd gzip

    # Redirección de www a dominio principal
    @www host www.acampadasetas.org
    handle @www {
        redir https://acampadasetas.org{uri} permanent
    }

    # Proxy hacia la aplicación Astro SSR en Node.js
    handle {
        reverse_proxy web:8080 {
            header_up X-Forwarded-Proto {scheme}
            header_up X-Real-IP {remote_host}
        }
    }
}
```

*(Si se prefiere Nginx en el servidor, se configura un `proxy_pass http://127.0.0.1:8080;` estándar con Certbot).*

---

## 6. Automatización CI/CD con GitHub

Para cumplir el requisito de que **el desarrollador solo tenga que seguir haciendo commits y push a GitHub**, se implementa un workflow en GitHub Actions que actualiza el servidor automáticamente.

### 6.1. Flujo de Trabajo: `.github/workflows/deploy.yml`

Crear el archivo `.github/workflows/deploy.yml` en el repositorio:

```yaml
name: Deploy a Servidor Propio

on:
  push:
    branches:
      - main     # O la rama de producción configurada

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Conectar al Servidor y Desplegar
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          port: ${{ secrets.SERVER_PORT || 22 }}
          script: |
            set -e
            echo "Iniciando despliegue de Acampada Setas..."
            
            # Ir al directorio del proyecto
            cd /opt/acampadasetas
            
            # Descargar los últimos cambios del repositorio
            git fetch origin main
            git reset --hard origin/main
            
            # Recompilar la imagen Docker con el nuevo código y reiniciar
            docker compose build web
            docker compose up -d web
            
            # Limpieza preventiva de imágenes huérfanas
            docker image prune -f
            
            echo "¡Despliegue completado con éxito!"
```

### 6.2. Secretos a configurar en GitHub (`Settings -> Secrets and variables -> Actions`):
1. **`SERVER_HOST`**: Dirección IP o dominio del servidor VPS.
2. **`SERVER_USER`**: Usuario con permisos para ejecutar docker (ej. `deploy` o `root`).
3. **`SERVER_SSH_KEY`**: Clave privada SSH (ed25519) generada para el bot de despliegue.
4. **`SERVER_PORT`**: Puerto SSH (por defecto 22).

---

## 7. Mejoras de Seguridad Recomendadas para el Backend Propio

Al migrar fuera del ecosistema gestionado de Google Cloud, el administrador de sistemas y el desarrollador backend deben considerar los siguientes puntos de seguridad:

1. **Hash de Contraseñas:**
   - Actualmente las contraseñas en `users.json` están en texto plano por compatibilidad con el entorno local de desarrollo.
   - *Acción recomendada:* Instalar `bcrypt` o `@node-rs/bcrypt` en `src/lib/users.ts` y hashear las contraseñas al registrarlas y validarlas.
2. **Firma y Cifrado de Cookies de Sesión:**
   - Actualmente `as_session_user` almacena el JSON del usuario en la cookie HTTP-only.
   - *Acción recomendada:* Definir una variable de entorno `SESSION_SECRET` y firmar la cookie con HMAC (SHA-256) o emitir un JWT para impedir que nadie pueda alterar su rol en el cliente.
3. **Copias de Seguridad (Backups) del volumen de datos:**
   - El sysadmin debe configurar un cronjob en el servidor que haga backup diario del directorio `/opt/acampadasetas/data/` (tar.gz comprimido o sincronización hacia un almacenamiento externo como rsync/Restic/Borg).

---

## 8. Checklist de Tareas para el Administrador de Sistemas

Para dar de alta el entorno, el sysadmin solo necesita ejecutar estos pasos:

- [ ] **1. Servidor:** Crear instancia VPS con Ubuntu 22.04/24.04 y configurar firewall (abrir puertos 80, 443 y SSH).
- [ ] **2. Docker:** Instalar Docker Engine y el plugin Docker Compose.
- [ ] **3. Repositorio:** Clonar el repositorio en `/opt/acampadasetas`.
- [ ] **4. Permisos y Datos:** Crear el directorio `/opt/acampadasetas/data/uploads` y asegurar permisos de escritura para el contenedor de Node.js.
- [ ] **5. Dominio y DNS:** Apuntar los registros DNS `A` y `AAAA` de `acampadasetas.org` a la IP pública del nuevo servidor.
- [ ] **6. Iniciar Servicios:** Ejecutar `docker compose up -d` y verificar emisión del certificado SSL en Caddy.
- [ ] **7. Claves SSH para GitHub:** Crear par de claves SSH en el servidor, añadir la clave pública a `~/.ssh/authorized_keys` y la clave privada en los Secrets de GitHub Actions.
- [ ] **8. Comprobación Final:** Hacer un commit de prueba en GitHub y confirmar que el despliegue automático actualiza la web correctamente sin intervención manual.

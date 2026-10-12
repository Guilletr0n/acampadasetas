# Frontend de sitio web de Acampada Setas

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/          # Static assets copied as-is (favicons, robots.txt, images)
├── scripts/         # Utility scripts (e.g. seed-admin.js)
├── src/
│   ├── assets/      # Images and other assets
│   ├── components/  # Reusable Astro components (incl. sections/)
│   ├── layouts/     # Page layouts (Layout.astro)
│   ├── lib/         # Shared logic (auth, db, storage, types, users)
│   ├── pages/       # Routes and API endpoints
│   └── styles/      # Global CSS
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🗄️ Backend

This is a **server-rendered Astro app** running on Node.js (the `@astrojs/node` adapter in `standalone` mode). The backend is hosted on **Google Cloud Run** and uses **Google Cloud** services for data and media, with local filesystem fallbacks for development.

### Stack

| Layer      | Technology                                        |
| :--------- | :------------------------------------------------ |
| Runtime    | Node.js `>=22.12` (SSR via `@astrojs/node`)       |
| Hosting    | Google Cloud Run (Docker)                         |
| Database   | Google Cloud Firestore (local JSON fallback)      |
| Media      | Google Cloud Storage (local file fallback)        |
| Auth       | Custom cookie-based sessions + RBAC               |

### Data layer

Content (sections, gallery, schedule/activities, section history) and users are stored in **Firestore**, with an automatic fallback to JSON files under `.data/` when no Firestore credentials are available (local development).

- `src/lib/db.ts` — sections, gallery, activities, and history CRUD
- `src/lib/users.ts` — user CRUD + initial seed users

### Media storage

Image uploads (`src/lib/storage.ts`) are:

- Limited to **5 MB**
- Converted to **WebP** (`quality: 85`) via `sharp`
- Uploaded to **Cloud Storage** bucket `acampadasetas-media`, falling back to `.data/uploads/` locally

### Authentication & authorization

Auth (`src/lib/auth.ts`) uses an `httpOnly` session cookie (`as_session_user`, 7 days, `secure` in production). Roles are `admin`, `editor`, and `reader` (`src/lib/types.ts`).

- `/admin/*` — requires login + an `approved` account (enforced in `src/middleware.ts`)
- `/admin/users` — admin only (returns `403` otherwise)
- Editors and admins can create/edit content; only admins manage users

### API endpoints

| Method | Endpoint                     | Description              |
| :----- | :--------------------------- | :----------------------- |
| POST   | `/api/auth/login`            | Sign in                  |
| POST   | `/api/auth/logout`           | Sign out                 |
| POST   | `/api/auth/register`         | Register (pending approval) |
| GET/POST/PUT/DELETE | `/api/admin/sections` | Manage content sections |
| GET/POST/PUT/DELETE | `/api/admin/gallery`  | Manage gallery items    |
| GET/POST/PUT/DELETE | `/api/admin/activities` | Manage schedule activities |
| GET/POST | `/api/admin/users`         | List/create users        |
| PUT/DELETE | `/api/admin/users/[uid]` | Update/delete a user   |
| POST   | `/api/upload`                | Upload an image          |
| GET    | `/api/media/[filename]`      | Serve a local image      |

### Security rules

Access control is defined in `firestore.rules` and `storage.rules`: public read, editor/admin write, with a 5 MB + image-type limit on storage uploads.

### Deployment

The `Dockerfile` builds a production image and runs `node dist/server/entry.mjs` on port `8080`. `cloudbuild.yaml` deploys it to Cloud Run in `europe-west1` and `europe-southwest1`.

Key environment variables:

| Variable                      | Purpose                                   |
| :---------------------------- | :---------------------------------------- |
| `GCP_PROJECT_ID`              | GCP project (`acampadasetas`)             |
| `FIRESTORE_DATABASE_ID`       | Firestore database (`acampadasetas`)      |
| `GCS_BUCKET_NAME`             | Storage bucket (`acampadasetas-media`)    |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Service account JSON (production)        |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to `service-account.json`         |

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

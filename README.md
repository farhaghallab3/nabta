# 🌱 Nabta

**From the field to your door — fully transparent.**

Nabta connects consumers directly to real farms in Egypt. Consumers *adopt* a
share of a crop or animal batch and follow its journey — harvest, cold storage,
transport, market, delivery — through QR-tracked supply-chain events. Farmers
register batches, print a QR label, and log each stage from their phone,
reducing post-harvest loss.

> Portfolio project. Django REST API + React (Vite) + Tailwind.

---

## Screenshots

| Landing | Browse batches | Batch detail |
| --- | --- | --- |
| ![Landing](docs-screenshots/01-landing.png) | ![Batches](docs-screenshots/02-batches.png) | ![Batch detail](docs-screenshots/03-batch-detail.png) |

| My adoptions (consumer) | Farmer dashboard | Loss analytics |
| --- | --- | --- |
| ![My adoptions](docs-screenshots/06-my-adoptions.png) | ![Farmer dashboard](docs-screenshots/08-farmer-dashboard.png) | ![Analytics](docs-screenshots/09-analytics.png) |

---

## Stack

| Layer     | Tech                                                            |
| --------- | -------------------------------------------------------------- |
| Backend   | Django 5.2, Django REST Framework, SimpleJWT, django-filter    |
| Database  | PostgreSQL (SQLite fallback for local dev)                     |
| Frontend  | React 19 (Vite), React Router, Tailwind CSS, Recharts, Axios   |
| QR codes  | `qrcode` (Python) for generation, `BarcodeDetector` for scanning |
| Deploy    | Vercel (frontend) · Render/Railway (backend + Postgres)        |

---

## Local development

### 1. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                   # optional — SQLite works with no .env
python manage.py migrate
python manage.py seed                                  # 4 farms, 5 batches, demo users
python manage.py runserver                             # http://127.0.0.1:8000
```

**Demo logins** (created by `seed`): `farmer` / `consumer` / `admin` — password `nabtademo123`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                                            # http://localhost:5173
```

The Vite dev server proxies `/api` and `/media` to `http://127.0.0.1:8000`, so no
CORS setup is needed locally.

---

## API

| Method | Endpoint                          | Auth        | Purpose                             |
| ------ | --------------------------------- | ----------- | ----------------------------------- |
| POST   | `/api/auth/register/`            | –           | Create account (role: consumer/farmer), returns JWT |
| POST   | `/api/auth/login/`              | –           | Obtain JWT pair + user              |
| POST   | `/api/auth/refresh/`           | –           | Refresh access token               |
| GET    | `/api/auth/me/`                | JWT         | Current user                       |
| GET    | `/api/batches/`                | –           | List batches (`?search=`, `?category=`, `?mine=1`) |
| POST   | `/api/batches/`               | Farmer      | Create batch (auto-generates QR)   |
| GET    | `/api/batches/{id}/`          | –           | Batch detail + tracking timeline + QR image |
| POST   | `/api/batches/{id}/adopt/`   | Consumer    | Adopt a share                      |
| POST   | `/api/batches/{id}/track-event/` | Farmer  | Log a supply-chain stage           |
| GET    | `/api/my-adoptions/`         | Consumer    | Consumer's adopted batches + status |
| GET    | `/api/farmer/analytics/`     | Farmer      | Loss % per stage summary           |
| GET/POST | `/api/farms/`              | – / Farmer  | List / create farms                |

Run the API tests:

```bash
cd backend && python manage.py test
```

---

## Deployment

### Backend → Render (or Railway)

- **Render:** the repo ships `backend/render.yaml` — "New → Blueprint" picks it up,
  provisions Postgres, and wires `DATABASE_URL`. Set `DJANGO_CORS_ALLOWED_ORIGINS`
  and `DJANGO_CSRF_TRUSTED_ORIGINS` to your Vercel URL.
- **Railway:** `backend/Procfile` is used as-is. Add a Postgres plugin, then set
  `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, `DJANGO_ALLOWED_HOSTS`,
  `DJANGO_CORS_ALLOWED_ORIGINS`.

Static files are served by WhiteNoise; run `python manage.py collectstatic` in the
build step.

### Frontend → Vercel

- Root directory: `frontend`
- `frontend/vercel.json` handles the SPA rewrite.
- Set env var `VITE_API_URL` to `https://<your-backend-host>/api`.

---

## Project layout

```
backend/
  config/         Django project (settings, urls, wsgi/asgi)
  accounts/       Custom User with role, JWT auth endpoints
  core/           Farm, Batch, ConsumerSubscription, TrackingEvent
                  serializers, viewsets, role permissions, QR helper
                  management/commands/seed.py
frontend/
  src/
    components/    BatchCard, StageStepper, StatCard, ProgressBar, Navbar, …
    context/       AuthContext (JWT + refresh)
    lib/           api.js (axios + interceptors), format.js
    pages/         Landing, ForFarmers, Batches, BatchDetail, Login, Register
      consumer/    MyAdoptions
      farmer/      FarmerDashboard, RegisterBatch, LogEvent, Analytics
```

---

## Data model

- **Farm** — name, owner (User), location, photo, story
- **Batch** — farm, crop type, category, quantity, price/share, planted &
  expected-harvest dates, unique `qr_code`
- **ConsumerSubscription** — user × batch (unique), quantity committed
- **TrackingEvent** — batch, stage (`harvest → cold_storage → transport → market
  → delivered`), quantity OK / damaged, location, timestamp

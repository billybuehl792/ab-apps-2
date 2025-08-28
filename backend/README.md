# Django REST API with JWT Auth, Clients & WorkOrders

A Django + Django REST Framework backend with JWT authentication and two models: `Client` (customers) and `WorkOrder` (work orders) in a one-to-many relationship.

---

## 🚀 Features

- JWT authentication using `djangorestframework-simplejwt`
- CRUD API for Clients and WorkOrders
- Filtering, searching, and ordering with DRF
- Django Admin integration
- Extensible for per-user or per-company ownership

---

## 🛠️ Requirements

- Python 3.9+
- pip / virtualenv

---

## 📦 Setup & Installation

```bash
# 1. Clone the repository
 git clone <your-repo-url>
 cd <project-folder>

# 2. Create & activate a virtual environment
 python -m venv .venv
 source .venv/bin/activate   # Windows: .venv\Scripts\activate

# 3. Install dependencies
 pip install -r requirements.txt

# If requirements.txt is missing, install manually:
 pip install django djangorestframework djangorestframework-simplejwt django-filter

# 4. Run database migrations
 python manage.py makemigrations
 python manage.py migrate

# 5. Create an admin user (optional)
 python manage.py createsuperuser

# 6. Start the development server
 python manage.py runserver
```

The API will be available at: **http://127.0.0.1:8000/api/**

---

## 🔑 Authentication

We use JWT for auth.

- Register: `POST /api/auth/register/`
- Obtain token: `POST /api/auth/token/`
- Refresh token: `POST /api/auth/token/refresh/`

### Example: Obtain Token

```bash
curl -X POST http://127.0.0.1:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo12345"}'
```

Response:

```json
{
  "access": "<ACCESS_TOKEN>",
  "refresh": "<REFRESH_TOKEN>"
}
```

Use the token in your requests:

```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://127.0.0.1:8000/api/clients/
```

---

## 📚 API Endpoints

### Clients

- `GET /api/clients/` → list all clients
- `POST /api/clients/` → create a new client
- `GET /api/clients/{id}/` → retrieve one client
- `PUT/PATCH /api/clients/{id}/` → update client
- `DELETE /api/clients/{id}/` → delete client

### work-orders

- `GET /api/work-orders/` → list all work-orders
- `POST /api/work-orders/` → create a work-order
- `GET /api/work-orders/{id}/` → retrieve one work-order
- `PUT/PATCH /api/work-orders/{id}/` → update work-order
- `DELETE /api/work-orders/{id}/` → delete work-order

Supports filtering, searching, and ordering. Example:

```bash
/work-orders/?client=1&status=in_progress&ordering=price
```

---

## ⚙️ Project Structure

```
project-root/
├── core/                # Django project settings
├── api/                 # App containing models, views, serializers
│   ├── models.py        # Database models (Client, WorkOrder)
│   ├── serializers.py   # DRF serializers (JSON ↔ Models)
│   ├── views.py         # API endpoints (ViewSets)
│   ├── admin.py         # Django admin config
├── manage.py
├── requirements.txt
└── README.md
```

---

## 🗄️ Database

- Default: SQLite (good for dev/testing)
- For production: switch to PostgreSQL or another RDBMS in `settings.py`

---

## 🔧 Next Steps

- Configure production settings (`SECRET_KEY`, `ALLOWED_HOSTS`, DB config)
- Add ownership (link Clients/work-orders to `User`) for multi-user apps
- Deploy backend to services like Railway, Render, or Heroku
- Deploy frontend (React/Vite) separately on Vercel and point it to this API

---

## 📝 License

MIT — feel free to use and modify.

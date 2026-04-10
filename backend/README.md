# Django REST API with JWT Auth

A Django + Django REST Framework backend with JWT authentication.

---

## 🚀 Features

- JWT authentication using `djangorestframework-simplejwt`
- Filtering, searching, and ordering with DRF
- Django Admin integration

---

## 🛠️ Requirements

- Python 3.9+
- pip / virtualenv

---

## 📦 Setup & Installation

### 1. Clone the repository

```bash
 git clone https://github.com/billybuehl792/ab-apps-2.git
 cd ab-apps-2/backend
```

### 2. Create & activate a virtual environment

```bash
python -m venv .venv
source .venv/bin/activate # Windows: .venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create your environment file and add variables

```bash
cp .env.sample .env # Windows (PowerShell): Copy-Item .env.sample .env
```

### 5. Run database migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create a superuser

```bash
python manage.py createsuperuser
```

### 7. Start the development server

```bash
python manage.py runserver
```

to expose on network (for preview):

```bash
python manage.py runserver 0.0.0.0:8000
```

The API will be available at: **http://127.0.0.1:8000/api/** or **http://192.168.1.x:8000/api/**

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
curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://127.0.0.1:8000/api/contacts/
```

---

## ⚙️ Project Structure

```
project-root/
├── core/                # Django project settings
├── api/                 # App containing models, views, serializers
│   ├── models.py        # Database models (Contact, Place, etc.)
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
- Deploy backend to services like Railway, Render, or Heroku
- Deploy frontend (React/Vite) separately on Vercel and point it to this API

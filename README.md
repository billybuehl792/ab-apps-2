# AB Apps 2: Django REST API & React/Vite Frontend

A full-stack project with a Django REST backend (JWT auth, Clients & Jobs) and a React + TypeScript + Vite frontend.

---

## Backend: Django REST API

- JWT authentication (`djangorestframework-simplejwt`)
- CRUD for Clients & Jobs (one-to-many)
- Filtering, searching, ordering
- Django Admin

**Setup**

```bash
# Clone & enter repo
git clone <your-repo-url> ab-apps
cd ab-apps/backend

# Create & activate virtualenv
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Migrate DB
python manage.py migrate

# (Optional) Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver
```

API: http://127.0.0.1:8000/api/

**Auth Endpoints**

- Register: `POST /register/`
- Token: `POST /token/`
- Refresh: `POST /token/refresh/`

**Main Endpoints**

- Clients: `/clients/`
- Jobs: `/jobs/`

Supports filtering, searching, ordering:
`/jobs/?client=1&status=in_progress&ordering=price`

---

## Frontend: React + TypeScript + Vite

- Minimal Vite setup with HMR
- ESLint config for type-aware linting
- Extensible for production apps

**Setup**

```bash
cd frontend/
npm install
npm run dev
```

App: http://localhost:5173/

**ESLint (TypeScript)**

- Uses recommended type-checked rules
- See `eslint.config.js` for React/DOM plugin options

---

## Project Structure

```
backend/
	app/...
	config/...
	manage.py
frontend/
	src/...
	public/...
	package.json
```

---

## Next Steps

- Link Clients/Jobs to Users for multi-user support
- Configure production settings
- Deploy backend (Railway, Render, Heroku)
- Deploy frontend (Vercel, Netlify)

---

## License

This project is private and not licensed for public use or distribution at this time.

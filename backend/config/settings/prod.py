# prod.py
from .base import *

DEBUG = True

ALLOWED_HOSTS = ["*"]

CSRF_COOKIE_SECURE = True
CSRF_TRUSTED_ORIGINS = ["http://localhost"]

SESSION_COOKIE_SECURE = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:5173",
]
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# FORCE_SCRIPT_NAME = "/api"

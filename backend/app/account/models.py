from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    role = models.CharField(max_length=50, default="user")
    company = models.CharField(max_length=100, blank=True, null=True)

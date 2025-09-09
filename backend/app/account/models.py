from django.contrib.auth.models import AbstractUser
from django.db import models

from app.companies.models import Company


class CustomUser(AbstractUser):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="users"
    )

    REQUIRED_FIELDS = ['company']

    def __str__(self):
        return self.username

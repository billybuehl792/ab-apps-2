from enum import Enum
from django.contrib.auth.models import AbstractUser
from django.db import models

from app.companies.models import Company


class RoleEnum(Enum):
    USER = "user"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

    @classmethod
    def choices(cls):
        return [
            (role.value, role.name.replace("_", " ").title())
            for role in cls
        ]


class CustomUser(AbstractUser):
    role = models.CharField(
        max_length=20,
        choices=RoleEnum.choices(),
        default=RoleEnum.USER.value,
    )
    company = models.ForeignKey(
        Company,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users"
    )

    def __str__(self):
        return self.username

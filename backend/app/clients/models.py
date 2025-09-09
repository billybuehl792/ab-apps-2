from django.db import models

from app.common.models import TimeStampedModel
from app.places.models import Place
from app.companies.models import Company


class Client(TimeStampedModel):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="clients"
    )
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_primary = models.CharField(max_length=50)
    phone_secondary = models.CharField(max_length=50, null=True, blank=True)
    place = models.ForeignKey(
        Place,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="clients",
    )

    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return f"{self.first_name} {self.last_name} <{self.email}>"

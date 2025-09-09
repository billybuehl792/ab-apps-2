from django.db import models

from app.common.models import TimeStampedModel
from app.companies.models import Company


class Place(TimeStampedModel):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="places"
    )
    google_place_id = models.CharField(max_length=255)
    country = models.CharField(max_length=10)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    address_full = models.TextField(max_length=500)
    address_short = models.TextField(max_length=255)
    label = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.address_full

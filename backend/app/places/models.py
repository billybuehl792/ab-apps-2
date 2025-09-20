from django.db import models

from app.common.models import TimeStampedModel
from app.companies.models import Company


class Place(TimeStampedModel):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="places",
        editable=False,
    )
    google_place_id = models.CharField(max_length=255, unique=True)
    label = models.CharField(max_length=255, blank=True, default="")
    country = models.CharField(max_length=10, editable=False)
    state = models.CharField(max_length=100, editable=False)
    city = models.CharField(max_length=100, editable=False)
    postal_code = models.CharField(max_length=20, editable=False)
    address_full = models.TextField(max_length=500, editable=False)
    address_short = models.TextField(max_length=255, editable=False)
    latitude = models.FloatField(editable=False)
    longitude = models.FloatField(editable=False)

    def __str__(self):
        return self.address_full

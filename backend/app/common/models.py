from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Place(TimeStampedModel):
    address = models.TextField(blank=True)
    place_id = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.address or self.place_id or "Place"

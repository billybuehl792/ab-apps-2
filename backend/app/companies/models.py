from django.db import models

from app.common.models import TimeStampedModel


class Company(TimeStampedModel):
    label = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, default="")

    class Meta(object):  # type: ignore
        verbose_name = "Company"
        verbose_name_plural = "Companies"

    def __str__(self):
        return self.label

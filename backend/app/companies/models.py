from django.db import models

from app.common.models import TimeStampedModel


class Company(TimeStampedModel):
    label = models.CharField(max_length=255)
    description = models.TextField()

    class Meta(object):  # type: ignore
        verbose_name = "Company"
        verbose_name_plural = "Companies"

    def __str__(self):
        return self.label

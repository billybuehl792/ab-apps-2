from django.db import models
from typing import Optional
from decimal import Decimal

from app.clients.models import Client
from app.common.models import Place, TimeStampedModel


class Job(TimeStampedModel):
    class Status(models.TextChoices):
        NEW = "new", "New"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"
        CANCELED = "canceled", "Canceled"

    id: Optional[int]
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="jobs",
    )
    place = models.ForeignKey(
        Place,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="jobs",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.NEW)
    scheduled_date = models.DateField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    cost = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0"))

    def __str__(self):
        return f"{self.id}: {self.title} ({self.client.first_name} {self.client.last_name})"

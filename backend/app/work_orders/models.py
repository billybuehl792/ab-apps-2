from django.db import models
from typing import Optional
from decimal import Decimal

from app.common.models import Place, TimeStampedModel
from app.companies.models import Company
from app.clients.models import Client


class WorkOrder(TimeStampedModel):

    class Status(models.TextChoices):
        NEW = "new", "New"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"
        CANCELED = "canceled", "Canceled"

    label = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.NEW)
    scheduled_date = models.DateField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    cost = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0"))
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="work_orders",
    )
    place = models.ForeignKey(
        Place,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="work_orders",
    )

    class Meta(object):  # type: ignore
        verbose_name = "Work Order"
        verbose_name_plural = "Work Orders"

    def __str__(self):
        return f"{self.label}"

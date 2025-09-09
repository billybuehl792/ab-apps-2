from enum import Enum
from django.db import models
from decimal import Decimal

from app.common.models import TimeStampedModel
from app.companies.models import Company
from app.places.models import Place
from app.clients.models import Client


class StatusEnum(Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELED = "canceled"

    @classmethod
    def choices(cls):
        return [
            (item.value, item.name.replace("_", " ").title())
            for item in cls
        ]


class WorkOrder(TimeStampedModel):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="work_orders",
    )
    label = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    status = models.CharField(
        max_length=20, choices=StatusEnum.choices(), default=StatusEnum.NEW.value)
    scheduled_date = models.DateField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    cost = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0"))
    client = models.ForeignKey(
        Client,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
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
        return self.label

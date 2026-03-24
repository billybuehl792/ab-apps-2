from django.db import models
from decimal import Decimal
from django.contrib.contenttypes.fields import GenericRelation

from app.common.models import TimeStampedModel
from app.clients.models import Client
from app.documents.models import Document
from app.places.models import Place


class WorkOrderStatus(models.TextChoices):
    NEW = "new", "New"
    IN_PROGRESS = "in_progress", "In Progress"
    COMPLETED = "completed", "Completed"
    CANCELED = "canceled", "Canceled"


class WorkOrder(TimeStampedModel):
    label = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    status = models.CharField(
        max_length=20,
        choices=WorkOrderStatus.choices,
        default=WorkOrderStatus.NEW
    )
    cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00")
    )
    scheduled_date = models.DateField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)
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
    documents = GenericRelation(Document, related_query_name='work_order')

    class Meta:  # type: ignore
        verbose_name = "Work Order"
        verbose_name_plural = "Work Orders"

    def __str__(self):
        return self.label

    def add_document(self, **kwargs):
        """Helper method to create a document for this work order."""
        return Document.objects.create(
            content_object=self,
            **kwargs
        )

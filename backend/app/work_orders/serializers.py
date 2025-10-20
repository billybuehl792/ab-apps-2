from rest_framework.serializers import ModelSerializer

from .models import WorkOrder
from app.clients.serializers import ClientReadBasicSerializer
from app.places.serializers import PlaceReadBasicSerializer, PlaceWriteSerializer


class WorkOrderReadSerializer(ModelSerializer):
    """Serializer for WorkOrder model"""

    client = ClientReadBasicSerializer(read_only=True)
    place = PlaceReadBasicSerializer(read_only=True)

    class Meta:
        model = WorkOrder
        fields = ("id", "label", "description", "status",
                  "cost", "scheduled_date", "completed_date",
                  "client", "place", "created_at", "updated_at")
        read_only_fields = fields


class WorkOrderWriteSerializer(ModelSerializer):
    """Serializer for updating existing work orders."""

    place = PlaceWriteSerializer(
        allow_null=True,
        required=False,
    )

    class Meta:
        model = WorkOrder
        fields = ("id", "label", "description", "status",
                  "cost", "scheduled_date", "completed_date", "place")
        read_only_fields = ("id",)

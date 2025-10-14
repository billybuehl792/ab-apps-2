from rest_framework import serializers

from ..models import WorkOrder
from app.clients.serializers.core import ClientSerializer
from app.places.serializers import PlaceSerializer


class WorkOrderSerializer(serializers.ModelSerializer):
    """Serializer for WorkOrder model"""

    client = ClientSerializer(read_only=True)
    place = PlaceSerializer(read_only=True)

    class Meta:
        model = WorkOrder
        fields = ("id", "label", "description", "status",
                  "cost", "scheduled_date", "completed_date",
                  "client", "place", "created_at", "updated_at")
        read_only_fields = fields

from rest_framework import serializers

from .models import WorkOrder
from app.places.serializers_core import PlaceSerializer


class WorkOrderSerializer(serializers.ModelSerializer):
    """Serializer for WorkOrder model excluding company field."""

    place = PlaceSerializer(read_only=True, allow_null=True)

    class Meta:
        model = WorkOrder
        exclude = ("company",)
        read_only_fields = ("id", "created_at", "updated_at")

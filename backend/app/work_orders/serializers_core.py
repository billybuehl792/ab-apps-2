from rest_framework import serializers

from .models import WorkOrder
from app.places.serializers_core import PlaceBasicSerializer


class WorkOrderSerializer(serializers.ModelSerializer):
    """Serializer for WorkOrder model excluding company field."""

    place = PlaceBasicSerializer(read_only=True, allow_null=True)

    class Meta:
        model = WorkOrder
        exclude = ("company",)
        read_only_fields = ("id", "created_at", "updated_at")


class WorkOrderBasicSerializer(serializers.ModelSerializer):
    """Basic serializer for WorkOrder model with essential fields."""

    class Meta:
        model = WorkOrder
        fields = ("id", "label", "status")
        read_only_fields = ("id",)

from rest_framework import serializers

from app.common.models import Place
from .models import WorkOrder
from app.common.serializers import PlaceSerializer


class WorkOrderSerializer(serializers.ModelSerializer):
    place_id = serializers.PrimaryKeyRelatedField(
        queryset=Place.objects.all(), required=False
    )
    place = PlaceSerializer(read_only=True)

    class Meta:
        model = WorkOrder
        fields = [
            "id",
            "label",
            "description",
            "status",
            "cost",
            "scheduled_date",
            "completed_date",
            "client",
            "place_id",
            "place",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

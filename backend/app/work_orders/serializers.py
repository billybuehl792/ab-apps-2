from rest_framework import serializers

from app.common.models import Place
from app.clients.models import Client
from .models import WorkOrder
from app.clients.serializers import ClientSerializer
from app.common.serializers import PlaceSerializer


class WorkOrderSerializer(serializers.ModelSerializer):
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(), required=False, allow_null=True
    )
    client = ClientSerializer(read_only=True)
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
            "client_id",
            "client",
            "place_id",
            "place",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

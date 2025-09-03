from rest_framework import serializers

from app.common.models import Place
from .models import Client
from app.work_orders.models import WorkOrder
from app.common.serializers import PlaceSerializer


class ClientWorkOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkOrder
        fields = ["id", "label", "status"]


class ClientSerializer(serializers.ModelSerializer):
    work_orders = ClientWorkOrderSerializer(many=True, read_only=True)
    place_id = serializers.PrimaryKeyRelatedField(
        queryset=Place.objects.all(), required=False, allow_null=True
    )
    place = PlaceSerializer(read_only=True)

    class Meta:
        model = Client
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone_primary",
            "phone_secondary",
            "place_id",
            "place",
            "work_orders",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

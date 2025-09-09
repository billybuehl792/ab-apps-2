from rest_framework import serializers

from .models import Place
from app.work_orders.models import WorkOrder


class PlaceWorkOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkOrder
        fields = ["id", "label", "status"]


class PlaceSerializer(serializers.ModelSerializer):
    work_orders = PlaceWorkOrderSerializer(many=True, read_only=True)

    class Meta:
        model = Place
        fields = ["id", "google_place_id", "country", "state", "city",
                  "postal_code", "address_full", "address_short", "latitude", "longitude", "work_orders"]
        read_only_fields = [
            "id", "country", "state", "city", "postal_code",
            "address_full", "address_short", "latitude", "longitude",
            "work_orders"
        ]

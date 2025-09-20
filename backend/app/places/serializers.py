from rest_framework import serializers


from .models import Place
from app.clients.serializers_core import ClientSerializer
from app.work_orders.serializers_core import WorkOrderSerializer


class PlaceReadSerializer(serializers.ModelSerializer):
    clients = ClientSerializer(many=True, read_only=True)
    work_orders = WorkOrderSerializer(many=True, read_only=True)

    class Meta:
        model = Place
        exclude = ("company",)
        read_only_fields = (
            "id", "country", "state", "city", "postal_code",
            "address_full", "address_short", "latitude", "longitude", "clients", "work_orders",
        )

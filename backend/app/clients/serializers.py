from rest_framework.serializers import ModelSerializer, SerializerMethodField

from .models import Client
from app.places.serializers import PlaceReadBasicSerializer, PlaceWriteSerializer


class ClientReadSerializer(ModelSerializer):
    """Serializer for Client model"""

    place = PlaceReadBasicSerializer(read_only=True)
    documents_count = SerializerMethodField(read_only=True)
    work_orders_count = SerializerMethodField(read_only=True)

    class Meta:
        model = Client
        fields = ("id", "first_name", "last_name", "full_name",
                  "email", "phone_primary", "phone_secondary", "place", "documents_count",
                  "work_orders_count", "created_at", "updated_at")
        read_only_fields = fields

    def get_documents_count(self, obj):
        return obj.documents.count()

    def get_work_orders_count(self, obj):
        return obj.work_orders.count()


class ClientReadBasicSerializer(ModelSerializer):
    """Serializer for Client model with basic fields."""

    place = PlaceReadBasicSerializer(read_only=True)

    class Meta:
        model = Client
        fields = ("id", "full_name", "email", "phone_primary", "place")
        read_only_fields = fields


class ClientWriteSerializer(ModelSerializer):
    """Serializer for updating existing clients."""

    place = PlaceWriteSerializer(
        allow_null=True,
        required=False,
    )

    class Meta:
        model = Client
        fields = ("id", "first_name", "last_name", "full_name",
                  "email", "phone_primary", "phone_secondary", "place")
        read_only_fields = ("id", "full_name")

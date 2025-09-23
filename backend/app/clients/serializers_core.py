from rest_framework import serializers

from .models import Client
from app.places.serializers_core import PlaceBasicSerializer


class ClientSerializer(serializers.ModelSerializer):
    """Serializer for Client model excluding company field."""

    place = PlaceBasicSerializer(read_only=True, allow_null=True)

    class Meta:
        model = Client
        exclude = ("company",)
        read_only_fields = ("id", "created_at", "updated_at")


class ClientBasicSerializer(serializers.ModelSerializer):
    """Basic serializer for Client model with essential fields."""

    class Meta:
        model = Client
        fields = ("id", "full_name", "email", "phone_primary")
        read_only_fields = ("id",)

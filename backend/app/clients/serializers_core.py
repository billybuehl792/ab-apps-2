from rest_framework import serializers

from .models import Client
from app.places.serializers_core import PlaceSerializer


class ClientSerializer(serializers.ModelSerializer):
    """Serializer for Client model excluding company field."""

    place = PlaceSerializer(read_only=True, allow_null=True)

    class Meta:
        model = Client
        exclude = ("company",)
        read_only_fields = ("id", "created_at", "updated_at")

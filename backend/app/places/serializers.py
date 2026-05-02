from rest_framework import serializers

from .models import Place
from .services.place_factory import create_or_update_place_by_google_place_id


class PlaceReadSerializer(serializers.ModelSerializer):
    """Serializer for Place model."""

    class Meta:
        model = Place
        fields = "__all__"


class PlaceReadBasicSerializer(serializers.ModelSerializer):
    """Serializer for Place model with basic fields."""

    class Meta:
        model = Place
        fields = ("id", "google_place_id",
                  "address_full", "address_short", "city", "state")
        read_only_fields = fields


class PlaceWriteSerializer(serializers.Serializer):
    """Serializer for creating/updating Place model. Accepts 'google_place_id' to identify the place."""

    google_place_id = serializers.CharField(max_length=500)

    def create(self, validated_data):
        return create_or_update_place_by_google_place_id(
            validated_data["google_place_id"]
        )

    def update(self, instance, validated_data):
        return create_or_update_place_by_google_place_id(
            validated_data["google_place_id"]
        )

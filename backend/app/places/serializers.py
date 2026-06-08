from rest_framework import serializers

from .models import Place
from .services.place_factory import create_or_update_place_by_google_place_id


class PlaceSerializer(serializers.ModelSerializer):
    """Serializer for Place model."""

    class Meta:
        model = Place
        fields = ("id", "google_place_id",
                  "address_full", "address_short", "city", "state", "country", "postal_code", "latitude", "longitude", "created_at", "updated_at")
        read_only_fields = ("id", "address_full",
                            "address_short", "city", "state", "country", "postal_code", "latitude", "longitude", "created_at", "updated_at")

    def create(self, validated_data):
        google_place_id = validated_data.pop("google_place_id", None)
        return create_or_update_place_by_google_place_id(google_place_id)

    def update(self, instance, validated_data):
        google_place_id = validated_data.pop("google_place_id", None)
        return create_or_update_place_by_google_place_id(google_place_id)

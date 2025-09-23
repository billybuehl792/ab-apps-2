from rest_framework import serializers

from .models import Place


class PlaceSerializer(serializers.ModelSerializer):
    """Serializer for Place model excluding company field."""

    class Meta:
        model = Place
        exclude = ("company",)
        read_only_fields = (
            "id", "country", "state", "city", "postal_code",
            "address_full", "address_short", "latitude", "longitude",
        )


class PlaceBasicSerializer(serializers.ModelSerializer):
    """Basic serializer for Place model with essential fields."""

    class Meta:
        model = Place
        fields = ("id", "google_place_id", "address_short", "city", "state")
        read_only_fields = ("id", "google_place_id",
                            "address_short", "city", "state")

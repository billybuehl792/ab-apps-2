from rest_framework.serializers import ModelSerializer, ValidationError, IntegerField, CharField

from .models import Place
from .services.place_service import PlaceService


class PlaceReadSerializer(ModelSerializer):
    """Serializer for Place model."""

    class Meta:
        model = Place
        fields = ("id", "google_place_id", "address_full", "address_short",
                  "country", "state", "city", "postal_code",
                  "latitude", "longitude", "created_at", "updated_at")
        read_only_fields = fields


class PlaceReadBasicSerializer(ModelSerializer):
    """Serializer for Place model with basic fields."""

    class Meta:
        model = Place
        fields = ("id", "google_place_id",
                  "address_full", "address_short", "city", "state")
        read_only_fields = fields


class PlaceWriteSerializer(ModelSerializer):
    """Serializer for creating and updating `Place` model."""

    id = IntegerField(required=False, allow_null=True)
    google_place_id = CharField(
        max_length=255, required=False, allow_blank=True)

    class Meta:
        model = Place
        fields = ("id", "google_place_id", "address_full", "address_short",
                  "country", "state", "city", "postal_code",
                  "latitude", "longitude", "created_at", "updated_at")
        read_only_fields = ("address_full", "address_short",
                            "country", "state", "city", "postal_code",
                            "latitude", "longitude", "created_at", "updated_at")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._place_service = PlaceService()

    def to_internal_value(self, data):  # type: ignore
        """
        Convert incoming data into a validated dict for the place service.
        """
        if not data.get('id') and not data.get('google_place_id'):
            raise ValidationError(
                "You must provide either 'id' or 'google_place_id'."
            )

        return super().to_internal_value(data)

    def create(self, validated_data):  # type: ignore[override]
        try:
            place, _ = self._place_service.get_or_create(validated_data)
            return place
        except Exception as e:
            raise ValidationError(f"Place retrieval/creation failed: {str(e)}")

    def update(self, instance, validated_data):  # type: ignore[override]
        try:
            place, _ = self._place_service.get_or_create(validated_data)
            return place
        except Exception as e:
            raise ValidationError(f"Place retrieval/creation failed: {str(e)}")

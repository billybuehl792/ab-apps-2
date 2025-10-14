from rest_framework.serializers import ModelSerializer, ValidationError, IntegerField, CharField

from .models import Place
from .services.place_service import PlaceService
from app.common.services.utils import get_user_company_from_context_or_raise


class PlaceSerializer(ModelSerializer):
    """Serializer for Place model excluding company field."""

    class Meta:
        model = Place
        fields = ("id", "google_place_id", "address_full", "address_short",
                  "country", "state", "city", "postal_code",
                  "latitude", "longitude", "created_at", "updated_at")
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
        Convert incoming data (dict) into a `Place` instance.
        - If `id` is given, fetch that `Place`
        - Else if `google_place_id` exists, get or create it
        - Else create a new one
        """
        if not data.get('id') and not data.get('google_place_id'):
            raise ValidationError(
                "You must provide either 'id' or 'google_place_id'."
            )

        validated = super().to_internal_value(data)
        company = get_user_company_from_context_or_raise(self.context)

        try:
            place, _ = self._place_service.get_or_create(
                validated, company)
            return place
        except Exception as e:
            raise ValidationError(
                f"Place retrieval/creation failed: {str(e)}")

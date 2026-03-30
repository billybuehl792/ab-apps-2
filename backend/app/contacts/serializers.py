from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, SerializerMethodField

from .models import Contact, ContactTag
from app.places.serializers import PlaceReadBasicSerializer, PlaceWriteSerializer


class ContactTagSerializer(ModelSerializer):
    """Serializer for `ContactTag` model"""

    class Meta:
        model = ContactTag
        fields = ("id", "label", "description",
                  "color", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class ContactReadSerializer(ModelSerializer):
    """Serializer for `Contact` model"""

    place = PlaceReadBasicSerializer(read_only=True)
    tags = ContactTagSerializer(many=True, read_only=True)
    documents = PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Contact
        fields = ("id", "first_name", "last_name",
                  "email", "phone_primary", "phone_secondary", "place",
                  "tags", "documents", "created_at", "updated_at")
        read_only_fields = fields


class ContactWriteSerializer(ModelSerializer):
    """Serializer for creating/updating `Contact` instances."""

    place = PlaceWriteSerializer(
        allow_null=True,
        required=False,
    )

    class Meta:
        model = Contact
        fields = ("id", "first_name", "last_name",
                  "email", "phone_primary", "phone_secondary", "place", "tags")
        read_only_fields = ("id",)

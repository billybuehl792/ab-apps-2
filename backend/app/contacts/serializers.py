from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField

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

    def validate(self, attrs):
        first_name = attrs.get("first_name", getattr(
            self.instance, "first_name", None))
        last_name = attrs.get("last_name", getattr(
            self.instance, "last_name", None))

        if isinstance(first_name, str):
            first_name = first_name.strip()
            attrs["first_name"] = first_name

        if isinstance(last_name, str):
            last_name = last_name.strip()
            attrs["last_name"] = last_name

        if first_name and last_name:
            duplicate_exists = Contact.objects.exclude(
                pk=getattr(self.instance, "pk", None)
            ).filter(
                first_name__iexact=first_name,
                last_name__iexact=last_name,
            ).exists()

            if duplicate_exists:
                raise serializers.ValidationError({
                    "last_name": ["A contact with this first and last name already exists."],
                })

        return super().validate(attrs)

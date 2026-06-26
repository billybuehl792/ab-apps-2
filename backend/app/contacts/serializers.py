from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from django.contrib.contenttypes.models import ContentType

from .models import Contact
from app.documents.serializers import DocumentSerializer
from app.places.serializers import PlaceSerializer
from app.places.services.place_factory import create_or_update_place_by_google_place_id


class ContactSerializer(ModelSerializer):
    """Serializer for reading and writing `Contact` instances."""

    place = PlaceSerializer(read_only=True)
    google_place_id = serializers.CharField(
        max_length=500,
        required=False,
        allow_blank=True,
        write_only=True,
    )
    documents = DocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Contact
        fields = ("id", "first_name", "last_name",
                  "email", "phone_primary", "phone_secondary", "place",
                  "google_place_id", "documents", "created_at", "updated_at")
        read_only_fields = ("id", "place", "documents",
                            "created_at", "updated_at")

    def _apply_google_place_id(self, validated_data):
        google_place_id = validated_data.pop("google_place_id", None)

        if isinstance(google_place_id, str):
            google_place_id = google_place_id.strip()

        if google_place_id:
            validated_data["place"] = create_or_update_place_by_google_place_id(
                google_place_id
            )
        elif google_place_id == "":
            validated_data["place"] = None

        return validated_data

    def create(self, validated_data):
        validated_data = self._apply_google_place_id(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data = self._apply_google_place_id(validated_data)
        return super().update(instance, validated_data)

    def validate(self, attrs):
        google_place_id = attrs.get("google_place_id", None)

        if isinstance(google_place_id, str):
            attrs["google_place_id"] = google_place_id.strip()

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


class ContactDocumentSerializer(DocumentSerializer):
    """Serializer for documents scoped to a contact."""

    def create(self, validated_data):
        contact = self.context.get("contact")
        if contact is None:
            raise serializers.ValidationError({
                "non_field_errors": ["Contact context is required."],
            })

        request = self.context.get("request")
        validated_data["uploaded_by"] = (
            request.user if request and request.user.is_authenticated else None
        )
        validated_data["content_type"] = ContentType.objects.get_for_model(
            Contact)
        validated_data["object_id"] = contact.pk
        return super().create(validated_data)

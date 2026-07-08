from rest_framework import serializers

from .models import Job, JobComment
from app.contacts.serializers import ContactSerializer
from app.places.serializers import PlaceSerializer
from app.places.services.place_factory import create_or_update_place_by_google_place_id


class JobSerializer(serializers.ModelSerializer):
    """Serializer for reading and writing `Job` instances."""

    place = PlaceSerializer(read_only=True)
    google_place_id = serializers.CharField(
        max_length=500,
        required=False,
        allow_blank=True,
        write_only=True,
    )
    representatives = ContactSerializer(many=True, read_only=True)
    recipients = ContactSerializer(many=True, read_only=True)
    assignees = ContactSerializer(many=True, read_only=True)
    referred_by = ContactSerializer(many=True, read_only=True)
    documents = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Job
        fields = (
            "id",
            "description",
            "status",
            "categories",
            "amount",
            "paid",
            "representatives",
            "assignees",
            "recipients",
            "referred_by",
            "place",
            "documents",
            "google_place_id",
            "signed_at",
            "estimated_at",
            "sold_at",
            "scheduled_at",
            "completed_at",
            "invoiced_at",
            "paid_at",
            "cancelled_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "place",
            "documents",
            "created_at",
            "updated_at",
        )

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

        return super().validate(attrs)


class JobCommentSerializer(serializers.ModelSerializer):
    """Serializer for `JobComment` model."""

    class Meta:
        model = JobComment
        fields = ("id", "job", "content", "created_by",
                  "updated_by", "created_at", "updated_at")
        read_only_fields = ("id", "created_by", "updated_by",
                            "created_at", "updated_at")

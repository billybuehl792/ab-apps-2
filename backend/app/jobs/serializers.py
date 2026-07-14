from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType

from .models import Job, JobComment
from app.contacts.serializers import ContactSerializer
from app.documents.serializers import DocumentSerializer
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


class JobDocumentSerializer(DocumentSerializer):
    """Serializer for documents scoped to a job."""

    def create(self, validated_data):
        job = self.context.get("job")
        if job is None:
            raise serializers.ValidationError({
                "non_field_errors": ["Job context is required."],
            })

        request = self.context.get("request")
        validated_data["uploaded_by"] = (
            request.user if request and request.user.is_authenticated else None
        )
        validated_data["content_type"] = ContentType.objects.get_for_model(
            Job)
        validated_data["object_id"] = job.pk
        return super().create(validated_data)

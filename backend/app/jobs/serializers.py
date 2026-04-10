from rest_framework.serializers import ModelSerializer

from .models import Job
from app.places.serializers import PlaceWriteSerializer


class JobReadSerializer(ModelSerializer):
    """Serializer for Job model."""

    class Meta:
        model = Job
        fields = ("id", "label", "description", "assignee", "recipient",
                  "place", "scheduled_at", "completed_at", "created_at", "updated_at")
        read_only_fields = fields


class JobWriteSerializer(ModelSerializer):
    """Serializer for creating/updating `Job` instances."""

    place = PlaceWriteSerializer(
        allow_null=True,
        required=False,
    )

    class Meta:
        model = Job
        fields = ("id", "label", "description", "assignee", "recipient",
                  "place", "scheduled_at", "completed_at")
        read_only_fields = ("id",)

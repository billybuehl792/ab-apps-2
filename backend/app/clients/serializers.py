from rest_framework import serializers
from rest_framework.request import Request

from .models import Client
from app.places.serializers_core import PlaceBasicSerializer
from app.work_orders.serializers_core import WorkOrderSerializer
from app.places.services.place_utils import get_or_create_place_by_id


class ClientReadSerializer(serializers.ModelSerializer):
    work_orders = WorkOrderSerializer(many=True, read_only=True)
    place = PlaceBasicSerializer(read_only=True, allow_null=True)

    class Meta:
        model = Client
        exclude = ("company",)
        read_only_fields = ("created_at", "updated_at")


class ClientWriteSerializer(serializers.ModelSerializer):
    place = serializers.CharField(
        max_length=255,
        allow_null=True,
        required=False,
        help_text="Place identifier to create or reference existing place"
    )

    class Meta:
        model = Client
        exclude = ("company", "created_at", "updated_at")
        extra_kwargs = {
            'email': {'help_text': 'Email address of the client'},
            'phone_primary': {'help_text': 'Primary phone number of the client'},
            'phone_secondary': {'help_text': 'Secondary phone number of the client'},
        }

    def validate_place(self, value):
        """Validate and convert place identifier to Place instance."""
        if not value:
            return None

        request = self.context.get("request")
        if not request or not isinstance(request, Request):
            raise serializers.ValidationError("Invalid request context.")

        try:
            return get_or_create_place_by_id(request, value)
        except Exception as e:
            raise serializers.ValidationError(
                f"Error processing place: {str(e)}")

from rest_framework import serializers
from rest_framework.request import Request

from .models import WorkOrder
from app.clients.models import Client
from app.places.serializers_core import PlaceSerializer
from app.clients.serializers_core import ClientSerializer
from app.places.services.place_utils import get_or_create_place_by_id


class WorkOrderReadSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    place = PlaceSerializer(read_only=True)

    class Meta:
        model = WorkOrder
        exclude = ("company",)


class WorkOrderWriteSerializer(serializers.ModelSerializer):
    client = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.none(), allow_null=True, required=False)
    place = serializers.CharField(
        max_length=255,
        allow_null=True,
        required=False,
        help_text="Place identifier to create or reference existing place"
    )

    class Meta:
        model = WorkOrder
        exclude = ("company", "created_at", "updated_at")
        extra_kwargs = {
            'cost': {'min_value': 0},
            'scheduled_date': {'help_text': 'When the work is scheduled'},
            'completed_date': {'help_text': 'When the work was completed'},
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._set_clients_queryset()

    def _set_clients_queryset(self):
        """Set the client queryset filtered by user's company."""
        request = self.context.get("request")
        if request and hasattr(request, 'user') and hasattr(request.user, "company"):
            self.fields["client"].queryset = Client.objects.filter(
                company=request.user.company
            )

    def validate_place(self, value):
        """Validate and convert place identifier to Place instance."""
        if not value:
            return None

        request = self.context.get("request")
        if not request or not isinstance(request, Request):
            raise serializers.ValidationError("Invalid request context.")

        try:
            place = get_or_create_place_by_id(request, value)
            return place
        except Exception as e:
            raise serializers.ValidationError(
                f"Error processing place: {str(e)}")

from rest_framework import serializers


from .models import WorkOrder
from app.places.models import Place
from app.clients.models import Client
from app.places.serializers import PlaceSerializer
from app.places.services.place_utils import get_or_create_place_by_id


class WorkOrderClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ["id", "first_name", "last_name", "email", "phone_primary",
                  "phone_secondary", "place", "work_orders", "created_at", "updated_at"]


class WorkOrderReadSerializer(serializers.ModelSerializer):
    client = WorkOrderClientSerializer(read_only=True, allow_null=True)
    place = PlaceSerializer(read_only=True, allow_null=True)

    class Meta:
        model = WorkOrder
        fields = [
            "id",
            "label",
            "description",
            "status",
            "cost",
            "scheduled_date",
            "completed_date",
            "client",
            "place",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class WorkOrderWriteSerializer(serializers.ModelSerializer):
    client = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.none(), allow_null=True, required=False)
    place = serializers.CharField(
        max_length=255, allow_null=True, required=False)

    class Meta:
        model = WorkOrder
        fields = [
            "id",
            "label",
            "description",
            "status",
            "cost",
            "scheduled_date",
            "completed_date",
            "client",
            "place",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and hasattr(request.user, "company"):
            self.fields["client"].queryset = Client.objects.filter(
                company=request.user.company)

    def create(self, validated_data):
        request = self.context.get("request")
        company = getattr(request.user, "company", None) if request else None

        if "place" in validated_data and validated_data["place"]:
            place_id = validated_data.pop("place", None)
            if place_id:
                place = get_or_create_place_by_id(place_id, company)
                validated_data["place"] = place

        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get("request")
        company = getattr(request.user, "company", None) if request else None

        if "place" in validated_data and validated_data["place"]:
            place_id = validated_data.pop("place", None)
            if place_id:
                place = get_or_create_place_by_id(place_id, company)
                validated_data["place"] = place

        return super().update(instance, validated_data)

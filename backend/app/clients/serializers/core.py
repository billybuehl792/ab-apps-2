from rest_framework.serializers import ModelSerializer, SerializerMethodField

from ..models import Client
from app.places.serializers import PlaceSerializer


class ClientSerializer(ModelSerializer):
    """Serializer for Client model"""

    place = PlaceSerializer(read_only=True, allow_null=True)
    documents_count = SerializerMethodField(read_only=True)
    work_orders_count = SerializerMethodField(read_only=True)

    class Meta:
        model = Client
        fields = ("id", "first_name", "last_name", "full_name",
                  "email", "phone_primary", "place", "documents_count",
                  "work_orders_count", "created_at", "updated_at")
        read_only_fields = fields

    def get_documents_count(self, obj):
        return obj.documents.count()

    def get_work_orders_count(self, obj):
        return obj.work_orders.count()

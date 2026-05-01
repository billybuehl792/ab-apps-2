from rest_framework.serializers import ModelSerializer

from .models import Place


class PlaceSerializer(ModelSerializer):
    """Serializer for Place model."""

    class Meta:
        model = Place
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")

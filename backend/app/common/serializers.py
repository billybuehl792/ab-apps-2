
from rest_framework import serializers

from .models import Place


class PlaceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Place
        fields = ["id", "address", "place_id"]
        read_only_fields = ["created_at", "updated_at"]

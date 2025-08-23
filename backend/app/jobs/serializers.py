
from rest_framework import serializers

from app.common.models import Place
from .models import Job


class JobSerializer(serializers.ModelSerializer):
    place = serializers.PrimaryKeyRelatedField(
        queryset=Place.objects.all(), required=False)

    class Meta:
        model = Job
        fields = [
            "id",
            "client",
            "place",
            "title",
            "description",
            "status",
            "scheduled_date",
            "completed_date",
            "cost",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

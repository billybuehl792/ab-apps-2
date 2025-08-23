
from rest_framework import serializers

from app.clients.models import Client


class ClientSerializer(serializers.ModelSerializer):
    jobs_count = serializers.IntegerField(source="jobs.count", read_only=True)

    class Meta:
        model = Client
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone_primary",
            "phone_secondary",
            "place",
            "jobs_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

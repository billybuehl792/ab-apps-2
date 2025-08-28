
from rest_framework import serializers

from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            "id",
            "label",
            "description",
            "place",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

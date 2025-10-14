from rest_framework.serializers import ModelSerializer

from .models import Company


class CompanySerializer(ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at")

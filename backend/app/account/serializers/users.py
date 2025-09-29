from rest_framework import serializers

from app.companies.serializers import CompanySerializer
from app.account.models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    company = CompanySerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ("id", "username", "full_name", "first_name", "last_name",
                  "email", "groups", "company")
        read_only_fields = ("id", "groups", "company")

    def get_groups(self, obj):
        return [group.name for group in obj.groups.all()]

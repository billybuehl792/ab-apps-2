from rest_framework.serializers import ModelSerializer, SerializerMethodField

from app.companies.serializers import CompanySerializer
from app.account.models import CustomUser


class CustomUserSerializer(ModelSerializer):
    groups = SerializerMethodField()
    company = CompanySerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ("id", "username", "full_name", "first_name", "last_name",
                  "email", "groups", "company")
        read_only_fields = ("id", "groups", "company")

    def get_groups(self, obj):
        return [group.name for group in obj.groups.all()]

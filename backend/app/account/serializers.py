from rest_framework import serializers
from typing import Dict, Any


from .models import CustomUser, RoleEnum
from app.companies.models import Company
from app.companies.serializers import CompanySerializer


class CustomUserSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "first_name", "last_name",
                  "username", "email", "role", "company"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(), required=False
    )

    class Meta:
        model = CustomUser
        fields = ("username", "first_name", "last_name",
                  "email", "password", "role", "company_id")

    def create(self, validated_data: Dict[str, Any]):
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            role=validated_data.get("role", RoleEnum.USER.value),
            company=validated_data.get("company_id", None),
        )
        return user

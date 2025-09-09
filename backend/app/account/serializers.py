from django.contrib.auth.models import Group
from rest_framework import serializers
from typing import Dict, Any


from .models import CustomUser
from app.companies.models import Company
from app.companies.serializers import CompanySerializer


class CustomUserSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    company = CompanySerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "first_name", "last_name",
                  "username", "email", "groups", "company"]

    def get_groups(self, obj):
        return [group.name for group in obj.groups.all()]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    company = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(), required=True
    )
    groups = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(), many=True, required=True
    )

    class Meta:
        model = CustomUser
        fields = ("username", "first_name", "last_name",
                  "email", "password", "company", "groups")

    def validate_groups(self, value):
        if not value:
            raise serializers.ValidationError(
                "At least one group must be assigned.")
        return value

    def create(self, validated_data: Dict[str, Any]):
        groups = validated_data.pop("groups")
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            company=validated_data.get("company"),
        )
        user.groups.set(groups)
        return user

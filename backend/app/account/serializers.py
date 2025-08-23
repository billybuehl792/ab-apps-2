from rest_framework import serializers
from app.account.models import CustomUser
from typing import Dict, Any


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "role", "company"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ("username", "email", "password", "role", "company")

    def create(self, validated_data: Dict[str, Any]):
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            role=validated_data.get("role", "user"),
            company=validated_data.get("company", ""),
        )
        return user

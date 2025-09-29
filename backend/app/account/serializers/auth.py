from typing import Dict, Any

from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from app.account.models import CustomUser
from app.companies.models import Company
from app.account.services.auth_utils import validate_password_change, validate_password_strength


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

    def validate_password(self, value):
        return validate_password_strength(value)

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


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user or not getattr(self.user, "is_active", False):
            raise serializers.ValidationError("User account is disabled.")

        data['user_id'] = self.user.id  # type: ignore
        return data


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    @property
    def user(self):
        """Get the authenticated user from request context."""
        if not hasattr(self, '_user'):
            request = self.context.get('request')
            if not request:
                raise serializers.ValidationError(
                    {"non_field_errors": ["Request context is required."]}
                )

            if not hasattr(request, 'user') or not request.user.is_authenticated:
                raise serializers.ValidationError(
                    {"non_field_errors": ["Authentication required."]}
                )

            self._user = request.user
        return self._user

    def validate_current_password(self, value):
        if not self.user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate_new_password(self, value):
        try:
            return validate_password_change(value, self.user)
        except serializers.ValidationError:
            raise
        except Exception as e:
            raise serializers.ValidationError(str(e))

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords don't match."}
            )

        # Remove confirm_password from validated data as it's not needed
        attrs.pop('confirm_password', None)
        return attrs

    def update(self, instance, validated_data):
        """Use update method instead of save for better DRF integration."""
        instance.set_password(validated_data['new_password'])
        instance.save(update_fields=['password'])
        return instance

    def save(self, **kwargs):
        """Override save to use the user from context."""
        return self.update(self.user, self.validated_data)

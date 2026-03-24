from rest_framework.serializers import ModelSerializer, SerializerMethodField

from app.account.models import CustomUser


class CustomUserSerializer(ModelSerializer):
    groups = SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ("id", "username", "full_name", "first_name", "last_name",
                  "email", "groups")
        read_only_fields = ("id", "groups", "full_name")

    def get_groups(self, obj):
        return [group.name for group in obj.groups.all()]

from rest_framework.serializers import (
    ModelSerializer,
    SerializerMethodField,
    IntegerField,
)

from app.account.serializers.users import CustomUserSerializer


def HistorySerializerFactory(history_model):
    class HistorySerializer(ModelSerializer):
        id = IntegerField(source="history_id", read_only=True)
        user = CustomUserSerializer(source="history_user", read_only=True)
        changes = SerializerMethodField()
        action = SerializerMethodField()

        class Meta:
            model = history_model
            fields = (
                "id",
                "history_date",
                "user",
                "action",
                "changes",
            )

        def get_action(self, obj):
            return {
                "+": "Created",
                "~": "Updated",
                "-": "Deleted",
            }.get(obj.history_type, "Unknown")

        def get_changes(self, obj):
            prev = obj.prev_record

            if prev is None:
                return []

            delta = obj.diff_against(prev)

            return [
                {
                    "field": change.field,
                    "old": change.old,
                    "new": change.new,
                }
                for change in delta.changes
            ]

    return HistorySerializer

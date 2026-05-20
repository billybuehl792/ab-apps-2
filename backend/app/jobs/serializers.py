from rest_framework.serializers import ModelSerializer

from .models import Job, JobCategory, JobComment, JobExpense, JobExpenseCategory
from app.contacts.serializers import ContactReadSerializer
from app.places.serializers import PlaceReadSerializer, PlaceWriteSerializer


class JobReadSerializer(ModelSerializer):
    """Serializer for Job model."""

    place = PlaceReadSerializer(read_only=True)
    representative = ContactReadSerializer(read_only=True)
    recipient = ContactReadSerializer(read_only=True)
    assignee = ContactReadSerializer(read_only=True)
    referred_by = ContactReadSerializer(read_only=True)

    class Meta:
        model = Job
        fields = ("id", "label", "description", "categories", "amount", "paid", "representative", "assignee", "recipient", "referred_by",
                  "place", "scheduled_at", "completed_at", "sold_at", "invoiced_at", "created_at", "updated_at")
        read_only_fields = fields


class JobWriteSerializer(ModelSerializer):
    """Serializer for creating/updating `Job` instances."""

    place = PlaceWriteSerializer(
        allow_null=True,
        required=False,
    )

    class Meta:
        model = Job
        fields = ("id", "label", "description", "categories", "amount", "paid", "representative", "assignee", "recipient", "referred_by",
                  "place", "scheduled_at", "completed_at", "sold_at", "invoiced_at", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class JobCategorySerializer(ModelSerializer):
    """Serializer for `JobCategory` model."""

    class Meta:
        model = JobCategory
        fields = ("id", "label", "description", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class JobCommentSerializer(ModelSerializer):
    """Serializer for `JobComment` model."""

    class Meta:
        model = JobComment
        fields = ("id", "job", "content", "created_by",
                  "updated_by", "created_at", "updated_at")
        read_only_fields = ("id", "created_by", "updated_by",
                            "created_at", "updated_at")

    def create(self, validated_data):
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data["updated_by"] = self.context["request"].user
        return super().update(instance, validated_data)


class JobExpenseSerializer(ModelSerializer):
    """Serializer for `JobExpense` model."""

    class Meta:
        model = JobExpense
        fields = ("id", "job", "label", "category", "description",
                  "amount", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class JobExpenseCategorySerializer(ModelSerializer):
    """Serializer for `JobExpenseCategory` model."""

    class Meta:
        model = JobExpenseCategory
        fields = ("id", "label", "description", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")

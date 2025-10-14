from django.db.transaction import atomic
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, ValidationError

from ..models import Client
from app.work_orders.models import WorkOrder
from app.documents.serializers import DocumentCreateSerializer
from app.places.serializers import PlaceWriteSerializer
from app.common.services.utils import get_user_company_from_context, get_user_company_from_context_or_raise


class WorkOrderCreateSerializer(ModelSerializer):
    """Serializer for creating new work orders."""

    place = PlaceWriteSerializer(
        allow_null=True,
        required=False,
    )
    client = PrimaryKeyRelatedField(
        queryset=Client.objects.none(),
        allow_null=True,
        required=False
    )
    documents = DocumentCreateSerializer(
        many=True,
        required=False,
        allow_empty=True,
        help_text="List of documents to create for this work order"
    )

    class Meta:
        model = WorkOrder
        fields = ("id", "label", "description", "status",
                  "cost", "scheduled_date", "completed_date",
                  "client", "place", "documents")
        read_only_fields = ("id",)

    def __init__(self, *args, **kwargs):
        """Initialize serializer and set `client` queryset based on company."""
        super().__init__(*args, **kwargs)
        company = get_user_company_from_context(self.context)
        if company:
            self.fields['client'].queryset = Client.objects.filter(
                company=company)

    def create(self, validated_data):
        """Create `WorkOrder` and associated documents."""
        company = get_user_company_from_context_or_raise(self.context)
        documents = validated_data.pop('documents', [])

        try:
            with atomic():
                work_order = WorkOrder.objects.create(
                    **validated_data, company=company)
                self._handle_documents(work_order, documents)

                return work_order
        except Exception as e:
            raise ValidationError(
                f"Failed to create work order: {str(e)}"
            )

    def _handle_documents(self, work_order: WorkOrder, documents_data: list[dict]):
        """Helper method to create `WorkOrder` documents."""
        for doc in documents_data:
            try:
                work_order.add_document(**doc)
            except Exception as e:
                raise ValidationError(
                    f"Failed to create document: {str(e)}"
                )


class WorkOrderUpdateSerializer(ModelSerializer):
    """Serializer for updating existing work orders."""

    place = PlaceWriteSerializer(
        allow_null=True,
        required=False,
    )

    class Meta:
        model = WorkOrder
        fields = ("id", "label", "description", "status",
                  "cost", "scheduled_date", "completed_date")
        read_only_fields = ("id",)

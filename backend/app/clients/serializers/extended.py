from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, ValidationError
from django.db.transaction import atomic

from ..models import Client
from app.work_orders.models import WorkOrder
from app.places.serializers import PlaceWriteSerializer
from app.documents.serializers import DocumentCreateSerializer
from app.common.services.utils import get_user_company_from_context


class ClientCreateSerializer(ModelSerializer):
    """Serializer for creating new clients."""

    place = PlaceWriteSerializer(
        allow_null=True,
        required=False,
    )
    documents = DocumentCreateSerializer(
        many=True,
        required=False,
        allow_empty=True,
        help_text="List of documents to create for this client"
    )
    work_orders = PrimaryKeyRelatedField(
        many=True,
        required=False,
        allow_empty=True,
        queryset=WorkOrder.objects.none(),
        help_text="List of work order IDs to associate with this client"
    )

    class Meta:
        model = Client
        fields = ("id", "first_name", "last_name", "full_name",
                  "email", "phone_primary", "phone_secondary", "place",
                  "documents", "work_orders")
        read_only_fields = ("id", "full_name")

    def __init__(self, *args, **kwargs):
        """Initialize serializer and set `work_orders` queryset based on company."""
        super().__init__(*args, **kwargs)
        company = get_user_company_from_context(self.context)
        if company:
            self.fields['work_orders'].queryset = WorkOrder.objects.filter(
                company=company,
                client__isnull=True  # Only unassigned work orders
            )

    def create(self, validated_data):
        """Create `Client`, assign `WorkOrder`s and associate `Document`s."""
        company = get_user_company_from_context(self.context)
        documents = validated_data.pop('documents', [])
        work_orders = validated_data.pop('work_orders', [])

        try:
            with atomic():
                client = Client.objects.create(
                    **validated_data, company=company)
                self._handle_documents(client, documents)
                self._handle_work_orders(client, work_orders)

                return client
        except Exception as e:
            raise ValidationError(
                f"Failed to create client: {str(e)}"
            )

    def _handle_documents(self, client: Client, documents_data: list[dict]):
        """Helper method to create `Client` documents."""
        for doc in documents_data:
            try:
                client.add_document(**doc)
            except Exception as e:
                raise ValidationError(
                    f"Failed to create document: {str(e)}"
                )

    def _handle_work_orders(self, client: Client, work_orders: list[WorkOrder]):
        """Helper method to associate work orders with client."""
        if not work_orders:
            return

        # Validate work orders belong to the same company and are unassigned
        work_order_ids = [wo.pk for wo in work_orders]
        company = client.company

        valid_work_orders = WorkOrder.objects.filter(
            id__in=work_order_ids,
            company=company,
            client__isnull=True
        )

        if len(valid_work_orders) != len(work_orders):
            raise ValidationError(
                "Some work orders are invalid or already assigned"
            )

        valid_work_orders.update(client=client)


class ClientUpdateSerializer(ModelSerializer):
    """Serializer for updating existing clients."""

    place = PlaceWriteSerializer(
        allow_null=True,
        required=False,
    )

    class Meta:
        model = Client
        fields = ("id", "first_name", "last_name", "full_name",
                  "email", "phone_primary", "phone_secondary", "place")
        read_only_fields = ("id", "full_name")

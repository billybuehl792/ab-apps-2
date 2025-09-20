import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.request import Request
from rest_framework.response import Response

from app.common.filters import CaseInsensitiveListInFilter, ListInFilter
from app.common.views import CompanyScopedViewSet
from config.pagination import AdjustableSizePagination

from .models import WorkOrder
from .serializers import WorkOrderReadSerializer, WorkOrderWriteSerializer


class WorkOrderFilter(django_filters.FilterSet):
    """Filter set for WorkOrder model with client, status, and city filtering."""

    client = ListInFilter(
        field_name="client",
        lookup_expr="in",
        help_text="Filter by client IDs"
    )
    status = ListInFilter(
        field_name="status",
        lookup_expr="in",
        help_text="Filter by work order status"
    )
    place__city = CaseInsensitiveListInFilter(
        field_name="place__city",
        lookup_expr="in",
        help_text="Filter by city names (case insensitive)"
    )

    class Meta:
        model = WorkOrder
        fields = ("status", "client", "place__city")


class WorkOrderViewSet(CompanyScopedViewSet):
    """ViewSet for managing WorkOrder resources with filtering, search, and ordering."""

    queryset = WorkOrder.objects.select_related(
        "client", "place").order_by("-created_at")
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    filterset_class = WorkOrderFilter
    search_fields = ("label", "client__first_name", "client__last_name",
                     "client__email", "place__address_short", "place__city")
    ordering_fields = ("created_at", "scheduled_date",
                       "completed_date", "cost")
    pagination_class = AdjustableSizePagination

    def get_serializer_class(self):  # type: ignore
        """Return appropriate serializer class based on action."""
        if self.action in ("list", "retrieve"):
            return WorkOrderReadSerializer
        return WorkOrderWriteSerializer

    @action(detail=False, methods=("get",))
    def count(self, request: Request) -> Response:
        """Return the total count of work orders in the filtered queryset."""
        count = self.get_queryset().count()
        return Response({"count": count})

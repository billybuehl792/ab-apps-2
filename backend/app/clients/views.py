import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.request import Request
from rest_framework.response import Response

from app.common.filters import CaseInsensitiveListInFilter, ListInFilter
from app.common.views import CompanyScopedViewSet
from config.pagination import AdjustableSizePagination

from .models import Client
from .serializers import ClientReadSerializer, ClientWriteSerializer


class ClientFilter(django_filters.FilterSet):
    """Filter set for Client model with city and work order status filtering."""

    place__city = CaseInsensitiveListInFilter(
        field_name="place__city",
        lookup_expr="in",
        help_text="Filter by city names (case insensitive)"
    )
    work_orders__status = ListInFilter(
        field_name="work_orders__status",
        lookup_expr="in",
        help_text="Filter by work order status"
    )

    class Meta:
        model = Client
        fields = ["place__city", "work_orders__status"]


class ClientViewSet(CompanyScopedViewSet):
    """ViewSet for managing Client resources with filtering, search, and ordering."""

    queryset = Client.objects.select_related("place").order_by("-created_at")
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = ClientFilter
    search_fields = ("first_name", "last_name",
                     "email", "phone_primary", "place__address_full")
    ordering_fields = ("created_at", "first_name", "last_name")
    pagination_class = AdjustableSizePagination

    def get_serializer_class(self):  # type: ignore
        """Return appropriate serializer class based on action."""
        if self.action in ("list", "retrieve"):
            return ClientReadSerializer
        return ClientWriteSerializer

    @action(detail=False, methods=("get",))
    def count(self, request: Request) -> Response:
        """Return the total count of clients in the filtered queryset."""
        count = self.get_queryset().count()
        return Response({"count": count})

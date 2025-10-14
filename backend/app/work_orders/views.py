from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.status import HTTP_400_BAD_REQUEST

from app.common.permissions import IsFromCompany
from app.common.services.utils import get_user_company_from_request_or_raise
from .models import WorkOrder
from .serializers import WorkOrderSerializer, WorkOrderCreateSerializer, WorkOrderUpdateSerializer
from .filters import WorkOrderFilter


class WorkOrderViewSet(ModelViewSet):
    """ViewSet for managing `WorkOrder` resources with filtering, search, and ordering."""

    permission_classes = (IsAuthenticated, IsFromCompany)
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    filterset_class = WorkOrderFilter
    search_fields = ("label", "client__first_name", "client__last_name",
                     "client__email", "place__address_short", "place__city")
    ordering_fields = ("created_at", "scheduled_date",
                       "completed_date", "cost")

    def get_queryset(self):  # type: ignore
        company = get_user_company_from_request_or_raise(self.request)
        return WorkOrder.objects.filter(
            company=company).select_related('place').order_by("-created_at")

    def get_serializer_class(self):  # type: ignore
        """Return appropriate serializer class based on action."""
        if self.action == "create":
            return WorkOrderCreateSerializer
        elif self.action in ("update", "partial_update"):
            return WorkOrderUpdateSerializer
        return WorkOrderSerializer

    @action(detail=False, methods=("get",))
    def count(self, request):
        """Return the total count of the filtered queryset."""
        try:
            filtered_queryset = self.filter_queryset(self.get_queryset())
            count = filtered_queryset.count()
            return Response({"count": count})
        except Exception as e:
            return Response(
                {"error": "Failed to get count"},
                status=HTTP_400_BAD_REQUEST
            )

from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK

from .models import Client
from .serializers import ClientSerializer, ClientCreateSerializer, ClientUpdateSerializer
from .filters import ClientFilter
from app.common.permissions import IsFromCompany
from app.common.services.utils import get_user_company_from_request_or_raise


class ClientViewSet(ModelViewSet):
    """ViewSet for managing `Client` resources with filtering, search, and ordering."""

    permission_classes = (IsAuthenticated, IsFromCompany)
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    filterset_class = ClientFilter
    search_fields = ("first_name", "last_name",
                     "email", "phone_primary", "place__address_full")
    ordering_fields = ("created_at", "first_name", "last_name")

    def get_queryset(self):  # type: ignore
        company = get_user_company_from_request_or_raise(self.request)
        return Client.objects.filter(
            company=company).select_related('place').order_by("-created_at")

    def get_serializer_class(self):  # type: ignore[override]
        if self.action == 'create':
            return ClientCreateSerializer
        elif self.action in ('update', 'partial_update'):
            return ClientUpdateSerializer
        return ClientSerializer

    @action(detail=True, methods=("post",), url_path="assign-work-order")
    def assign_work_order(self, request: Request, pk=None):
        """Assign a `WorkOrder` to this `Client`."""
        from app.work_orders.models import WorkOrder
        from app.work_orders.serializers import WorkOrderSerializer

        client = self.get_object()
        work_order_id = request.data.get('work_order_id')

        if not work_order_id:
            return Response(
                {"error": "work_order_id is required"},
                status=HTTP_400_BAD_REQUEST
            )

        try:
            work_order = get_object_or_404(
                WorkOrder.objects.filter(company=client.company),
                id=work_order_id
            )

            if work_order.client and work_order.client != client:
                return Response(
                    {"error": f"Work order is already assigned to {work_order.client}"},
                    status=HTTP_400_BAD_REQUEST
                )

            work_order.client = client
            work_order.save(update_fields=['client'])

            return Response(
                {
                    "message": "Work order assigned successfully",
                    "client_id": client.id,
                    "work_order": WorkOrderSerializer(work_order).data
                },
                status=HTTP_200_OK
            )

        except ValueError:
            return Response(
                {"error": "Invalid work_order_id format"},
                status=HTTP_400_BAD_REQUEST
            )

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

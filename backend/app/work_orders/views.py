import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.decorators import action
from rest_framework.response import Response

from app.common.views import CompanyScopedViewSet
from app.common.filters import CaseInsensitiveListInFilter, ListInFilter
from .models import WorkOrder
from .serializers import WorkOrderReadSerializer, WorkOrderWriteSerializer


class WorkOrderFilter(django_filters.FilterSet):
    client = ListInFilter(
        field_name="client", lookup_expr="in")
    status = ListInFilter(
        field_name="status", lookup_expr="in")
    place__city = CaseInsensitiveListInFilter(
        field_name="place__city", lookup_expr="in")

    class Meta:
        model = WorkOrder
        fields = ['status', 'client', 'place__city']


class WorkOrderViewSet(CompanyScopedViewSet):
    queryset = WorkOrder.objects.all().order_by("-created_at")
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = WorkOrderFilter
    search_fields = ["label", "client__first_name", "client__last_name",
                     "client__email", "place__address_short", "place__city"]
    ordering_fields = ["created_at",
                       "scheduled_date", "completed_date", "cost"]

    def get_serializer_class(self):  # type: ignore
        if self.action in ["list", "retrieve"]:
            return WorkOrderReadSerializer
        return WorkOrderWriteSerializer

    @action(detail=False, methods=['get'])
    def count(self, request):
        count = self.get_queryset().count()
        return Response({'count': count})

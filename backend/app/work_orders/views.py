from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.decorators import action
from rest_framework.response import Response

from app.common.views import CompanyScopedViewSet
from .models import WorkOrder
from .serializers import WorkOrderReadSerializer, WorkOrderWriteSerializer


class WorkOrderViewSet(CompanyScopedViewSet):
    queryset = WorkOrder.objects.all().order_by("-created_at")
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["client", "status", "scheduled_date", "completed_date"]
    search_fields = ["label", "description",
                     "client__first_name", "client__last_name", "client__email"]
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

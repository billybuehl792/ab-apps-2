from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated

from .models import WorkOrder
from .serializers import WorkOrderSerializer


class WorkOrderViewSet(viewsets.ModelViewSet):
    serializer_class = WorkOrderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["client", "status", "scheduled_date", "completed_date"]
    search_fields = ["label", "description",
                     "client__first_name", "client__last_name", "client__email"]
    ordering_fields = ["created_at",
                       "scheduled_date", "completed_date", "cost"]

    def get_queryset(self):  # type: ignore
        user_company = getattr(self.request.user, 'company', None)
        return WorkOrder.objects.filter(client__company=user_company).order_by("created_at", "id")

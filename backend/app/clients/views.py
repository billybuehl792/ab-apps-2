from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

from app.common.views import CompanyScopedViewSet
from config.pagination import AdjustableSizePagination
from .models import Client
from .serializers import ClientReadSerializer, ClientWriteSerializer


class ClientViewSet(CompanyScopedViewSet):
    queryset = Client.objects.all().order_by("-created_at")
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["email", "first_name", "last_name"]
    search_fields = ["first_name", "last_name",
                     "email", "phone_primary", "place__address"]
    ordering_fields = ["created_at", "first_name", "last_name"]
    pagination_class = AdjustableSizePagination

    def get_serializer_class(self):  # type: ignore
        if self.action in ["list", "retrieve"]:
            return ClientReadSerializer
        return ClientWriteSerializer

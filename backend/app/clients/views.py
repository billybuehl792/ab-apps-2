from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.decorators import action
from rest_framework.status import HTTP_400_BAD_REQUEST

from .models import Client
from .serializers import ClientReadSerializer, ClientWriteSerializer
from .filters import ClientFilter


class ClientViewSet(ModelViewSet):
    """ViewSet for managing `Client` resources with filtering, search, and ordering."""

    permission_classes = (IsAuthenticated,)
    queryset = Client.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    filterset_class = ClientFilter
    search_fields = ("first_name", "last_name",
                     "email", "phone_primary", "place__address_full")
    ordering_fields = ("created_at", "updated_at", "first_name", "last_name")

    def get_serializer_class(self):  # type: ignore[override]
        if self.action in ("list", "retrieve"):
            return ClientReadSerializer
        return ClientWriteSerializer

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.status import HTTP_400_BAD_REQUEST

from app.common.permissions import IsFromCompany
from app.common.services.utils import get_user_company_from_request_or_raise
from .models import Client
from .serializers import ClientReadSerializer, ClientWriteSerializer
from .filters import ClientFilter


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
        if self.action in ("list", "retrieve", "count"):
            return ClientReadSerializer
        return ClientWriteSerializer

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

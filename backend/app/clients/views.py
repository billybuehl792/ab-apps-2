from django_filters.rest_framework import DjangoFilterBackend
from django.forms import ValidationError
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter

from config.pagination import AdjustableSizePagination
from .models import Client
from .serializers import ClientSerializer
from app.account.permissions import IsFromCompany


class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated, IsFromCompany]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["email", "first_name", "last_name"]
    search_fields = ["first_name", "last_name",
                     "email", "phone_primary", "place__address"]
    ordering_fields = ["created_at", "first_name", "last_name"]
    pagination_class = AdjustableSizePagination

    def get_queryset(self):  # type: ignore
        user_company = getattr(self.request.user, 'company', None)
        return Client.objects.filter(company=user_company).order_by("created_at", "id")

    def perform_create(self, serializer):
        user_company = getattr(self.request.user, 'company', None)
        if not user_company:
            raise ValidationError(
                "User must belong to a company to create a client.")
        serializer.save(company=user_company)

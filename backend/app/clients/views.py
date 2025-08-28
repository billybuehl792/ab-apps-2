from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter

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

    def get_queryset(self):  # type: ignore
        user_company = getattr(self.request.user, 'company', None)
        if user_company is None:
            return Client.objects.none()
        return Client.objects.filter(company=user_company)

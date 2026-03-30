from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import Contact, ContactTag
from .serializers import ContactReadSerializer, ContactTagSerializer, ContactWriteSerializer
from .filters import ContactsFilter


class ContactViewSet(ModelViewSet):
    """ViewSet for managing `Contact` resources with filtering, search, and ordering."""

    permission_classes = (IsAuthenticated,)
    queryset = Contact.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    filterset_class = ContactsFilter
    search_fields = ("first_name", "last_name",
                     "email", "phone_primary", "place__address_full")
    ordering_fields = ("created_at", "updated_at", "first_name", "last_name")

    def get_serializer_class(self):  # type: ignore[override]
        if self.action in ("list", "retrieve"):
            return ContactReadSerializer
        return ContactWriteSerializer


class ContactTagViewSet(ModelViewSet):
    """ViewSet for managing `ContactTag` resources."""

    permission_classes = (IsAuthenticated,)
    queryset = ContactTag.objects.all()
    serializer_class = ContactTagSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    search_fields = ("label", "description")
    ordering_fields = ("label", "color", "created_at", "updated_at")

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import Contact
from .serializers import ContactSerializer
from .filters import ContactsFilter


class ContactViewSet(ModelViewSet):
    """ViewSet for managing `Contact` resources with filtering, search, and ordering."""

    permission_classes = (IsAuthenticated,)
    queryset = Contact.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    filterset_class = ContactsFilter
    ordering = ("last_name", "first_name")
    ordering_fields = ("created_at", "updated_at", "first_name", "last_name")
    search_fields = ("first_name", "last_name",
                     "email", "phone_primary", "place__address_full")

    serializer_class = ContactSerializer

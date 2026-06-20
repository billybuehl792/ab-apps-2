from django.contrib.contenttypes.models import ContentType
from django.db.models import QuerySet
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter

from app.documents.models import Document

from .models import Contact
from .serializers import ContactDocumentSerializer, ContactSerializer
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


class ContactDocumentViewSet(ModelViewSet):
    """CRUD documents attached to a single contact."""

    permission_classes = (IsAuthenticated,)
    queryset = Document.objects.all()
    serializer_class = ContactDocumentSerializer
    filter_backends = (OrderingFilter, SearchFilter)
    ordering = ("created_at",)
    ordering_fields = ("created_at", "updated_at", "label")
    search_fields = ("label", "description", "original_filename", "mime_type")

    def _get_contact(self):
        if not hasattr(self, "_contact"):
            self._contact = get_object_or_404(
                Contact, pk=self.kwargs.get("contact_pk"))
        return self._contact

    def get_queryset(self) -> QuerySet[Document]:  # type: ignore[override]
        contact = self._get_contact()
        contact_type = ContentType.objects.get_for_model(Contact)
        return Document.objects.filter(content_type=contact_type, object_id=contact.pk)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["contact"] = self._get_contact()
        return context

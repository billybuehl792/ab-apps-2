from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.contenttypes.models import ContentType
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .models import Contact
from .serializers import ContactSerializer
from .filters import ContactsFilter
from app.documents.serializers import DocumentSerializer


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

    @action(detail=True, methods=["post"], url_path="documents")
    def upload_document(self, request, pk=None):
        contact = self.get_object()
        serializer = DocumentSerializer(
            data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save(
            uploaded_by=request.user if request.user.is_authenticated else None,
            content_type=ContentType.objects.get_for_model(Contact),
            object_id=contact.pk,
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

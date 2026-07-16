from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import OrderingFilter, SearchFilter

from .filters import DocumentsFilter
from .models import Document

from .serializers import DocumentSerializer


class DocumentViewSet(ModelViewSet):
    """ViewSet for managing Document resources with filtering, search, and ordering."""

    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    ordering = ("created_at",)
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    filterset_class = DocumentsFilter
    search_fields = ("label",)
    ordering_fields = ("created_at", "label")

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(uploaded_by=user)

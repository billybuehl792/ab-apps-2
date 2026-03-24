from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.decorators import action

from .models import Document

from .serializers import DocumentSerializer


class DocumentViewSet(ModelViewSet):
    """ViewSet for managing Document resources with filtering, search, and ordering."""

    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    search_fields = ("label",)
    ordering_fields = ("created_at", "label")
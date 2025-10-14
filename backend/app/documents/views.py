from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.status import HTTP_400_BAD_REQUEST

from .models import Document
from .serializers import DocumentSerializer
from app.common.services.utils import get_user_company_from_request_or_raise


class DocumentViewSet(ModelViewSet):
    """ViewSet for managing Document resources with filtering, search, and ordering."""

    serializer_class = DocumentSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    search_fields = ("label",)
    ordering_fields = ("created_at", "label")

    def get_queryset(self):  # type: ignore
        company = get_user_company_from_request_or_raise(self.request)
        return Document.objects.filter(company=company).order_by("-created_at")

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

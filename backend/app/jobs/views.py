from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import Job
from .serializers import JobReadSerializer, JobWriteSerializer
from .filters import JobsFilter


class JobViewSet(ModelViewSet):
    """ViewSet for managing `Job` resources with filtering, search, and ordering."""

    permission_classes = (IsAuthenticated,)
    queryset = Job.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    filterset_class = JobsFilter
    ordering = ("-created_at",)
    search_fields = ("label", "description", "assignee__first_name", "assignee__last_name",
                     "recipient__first_name", "recipient__last_name", "place__address_full")
    ordering_fields = ("created_at", "updated_at", "label",
                       "scheduled_at", "completed_at", "assignee__first_name", "assignee__last_name",
                       "recipient__first_name", "recipient__last_name")

    def get_serializer_class(self):  # type: ignore[override]
        if self.action in ("list", "retrieve"):
            return JobReadSerializer
        return JobWriteSerializer

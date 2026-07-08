from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import Job, JobComment
from .serializers import JobCommentSerializer, JobSerializer
from .filters import JobsFilter


class JobViewSet(ModelViewSet):
    """ViewSet for managing `Job` resources with filtering, search, and ordering."""

    permission_classes = (IsAuthenticated,)
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    filterset_class = JobsFilter
    ordering = ("-created_at",)
    search_fields = ("description", "recipients__first_name",
                     "recipients__last_name", "place__address_full")
    ordering_fields = ("created_at", "updated_at", "description", "amount",
                       "scheduled_at", "completed_at", "assignees__last_name",
                       "recipients__last_name", "representatives__last_name",
                       "place__address_full")

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user,
        )

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)


class JobCommentViewSet(ModelViewSet):
    """ViewSet for managing `JobComment` resources."""

    permission_classes = (IsAuthenticated,)
    queryset = JobComment.objects.all()
    serializer_class = JobCommentSerializer
    ordering = ("-created_at",)

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user,
        )

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.contenttypes.models import ContentType
from django.db.models import QuerySet
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter

from app.documents.models import Document
from app.common.serializers import HistorySerializerFactory
from .models import Job, JobComment
from .serializers import JobCommentSerializer, JobDocumentSerializer, JobSerializer
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


class JobDocumentViewSet(ModelViewSet):
    """CRUD documents attached to a single job."""

    permission_classes = (IsAuthenticated,)
    queryset = Document.objects.all()
    serializer_class = JobDocumentSerializer
    filter_backends = (OrderingFilter, SearchFilter)
    ordering = ("created_at",)
    ordering_fields = ("created_at", "updated_at", "label")
    search_fields = ("label", "description", "original_filename", "mime_type")

    def _get_job(self):
        if not hasattr(self, "_job"):
            self._job = get_object_or_404(
                Job, pk=self.kwargs.get("job_pk"))
        return self._job

    def get_queryset(self) -> QuerySet[Document]:  # type: ignore[override]
        job = self._get_job()
        job_type = ContentType.objects.get_for_model(Job)
        return Document.objects.filter(content_type=job_type, object_id=job.pk)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["job"] = self._get_job()
        return context


class JobHistoryViewSet(ReadOnlyModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = HistorySerializerFactory(
        Job.history.model)  # type: ignore
    filter_backends = (OrderingFilter, SearchFilter)
    ordering = ("-history_date",)
    ordering_fields = ("history_date",)
    search_fields = ("history_user__username",)

    def get_queryset(self):
        return (
            Job.history
            .filter(id=self.kwargs["job_pk"])  # type: ignore
            .order_by("-history_date")
        )

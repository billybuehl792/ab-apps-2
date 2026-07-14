from django.urls import path
from rest_framework import routers
from .views import JobCommentViewSet, JobDocumentViewSet, JobHistoryViewSet, JobViewSet

router = routers.DefaultRouter()
router.register(r"", JobViewSet, basename="job")
router.register(r"comments", JobCommentViewSet, basename="job-comment")

urlpatterns = [
    path(
        "<int:job_pk>/documents/",
        JobDocumentViewSet.as_view({"get": "list", "post": "create"}),
        name="job-documents-list",
    ),
    path(
        "<int:job_pk>/documents/<int:pk>/",
        JobDocumentViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
        name="job-documents-detail",
    ),
    path(
        "<int:job_pk>/history/",
        JobHistoryViewSet.as_view({"get": "list"}),
        name="job-history-list",
    ),
] + router.urls

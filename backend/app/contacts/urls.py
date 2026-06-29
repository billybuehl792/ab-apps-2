from django.urls import path
from rest_framework import routers
from .views import ContactDocumentViewSet, ContactHistoryViewSet, ContactViewSet

router = routers.DefaultRouter()
router.register(r"", ContactViewSet, basename="contact")

urlpatterns = [
    path(
        "<int:contact_pk>/documents/",
        ContactDocumentViewSet.as_view({"get": "list", "post": "create"}),
        name="contact-documents-list",
    ),
    path(
        "<int:contact_pk>/documents/<int:pk>/",
        ContactDocumentViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
        name="contact-documents-detail",
    ),
    path(
        "<int:contact_pk>/history/",
        ContactHistoryViewSet.as_view({"get": "list"}),
        name="contact-history-list",
    ),
] + router.urls

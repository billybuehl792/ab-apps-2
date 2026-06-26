from django.urls import path
from rest_framework import routers
from .views import ContactDocumentViewSet, ContactViewSet

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
] + router.urls

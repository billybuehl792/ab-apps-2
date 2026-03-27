from rest_framework import routers
from .views import ContactViewSet, ContactTagViewSet

router = routers.DefaultRouter()
router.register(r"tags", ContactTagViewSet, basename="contact-tag")
router.register(r"", ContactViewSet, basename="contact")

urlpatterns = router.urls

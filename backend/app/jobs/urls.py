from rest_framework import routers
from .views import JobViewSet

router = routers.DefaultRouter()
router.register(r"", JobViewSet, basename="job")

urlpatterns = router.urls

from rest_framework import routers
from .views import PlaceViewSet

router = routers.DefaultRouter()
router.register(r"", PlaceViewSet, basename="place")

urlpatterns = router.urls

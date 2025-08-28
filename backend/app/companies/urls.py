from rest_framework import routers
from .views import CompanyViewSet

router = routers.DefaultRouter()
router.register(r"", CompanyViewSet, basename="company")

urlpatterns = router.urls

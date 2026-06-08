from rest_framework import routers
from .views import JobCommentViewSet, JobViewSet

router = routers.DefaultRouter()
router.register(r"", JobViewSet, basename="job")
router.register(r"comments", JobCommentViewSet, basename="job-comment")

urlpatterns = router.urls

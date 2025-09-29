from rest_framework import routers
from .. import views

router = routers.DefaultRouter()
router.register(r'users', views.CustomUserViewSet, basename='user')

urlpatterns = router.urls

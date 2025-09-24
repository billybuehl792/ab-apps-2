from rest_framework import routers
from django.urls import include, path
from . import views

router = routers.DefaultRouter()
router.register(r'users', views.CustomUserViewSet, basename='user')

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("token/", views.CookieTokenObtainPairView.as_view(),
         name="token_obtain_pair"),
    path("token/refresh/", views.CookieTokenRefreshView.as_view(),
         name="token_refresh"),
    path("token/revoke/", views.CookieTokenRevokeView.as_view(), name="token_revoke"),
    path("me/", views.me, name="me"),

    path("", include(router.urls)),
]

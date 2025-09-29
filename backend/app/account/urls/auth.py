from django.urls import path
from .. import views

urlpatterns = [
    path("token/", views.CookieTokenObtainPairView.as_view(),
         name="token_obtain_pair"),
    path("token/refresh/", views.CookieTokenRefreshView.as_view(),
         name="token_refresh"),
    path("token/revoke/", views.CookieTokenRevokeView.as_view(), name="token_revoke"),
    path("change-password/", views.ChangePasswordView.as_view(),
         name="change_password"),
    path("me/", views.me, name="me"),
]

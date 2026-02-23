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
    path('request-password-reset/',
         views.RequestPasswordResetView.as_view(), name='request-password-reset'),
    path('reset-password/<str:uid>/<str:token>/',
         views.ResetPasswordView.as_view(), name='reset-password'),
    path("me/", views.me, name="me"),
]

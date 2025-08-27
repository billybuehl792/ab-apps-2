from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("token/", views.CookieTokenObtainPairView.as_view(),
         name="token_obtain_pair"),
    path("token/refresh/", views.CookieTokenRefreshView.as_view(),
         name="token_refresh"),
    path("sign-out/", views.SignOutView.as_view(), name="sign_out"),
    path("me/", views.me, name="me"),

]

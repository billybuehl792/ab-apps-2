from django.urls import include, path

urlpatterns = [
    path("auth/", include("app.account.urls.auth")),
    path("", include("app.account.urls.users")),
]

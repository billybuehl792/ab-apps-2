import os

from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

from config.pagination import AdjustableSizePagination
from .serializers import CustomUserSerializer, RegisterSerializer
from app.common.views import CompanyScopedViewSet
from app.account.models import CustomUser


REFRESH_TOKEN_COOKIE_NAME = "ab_refresh_token"


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class CookieTokenObtainPairView(TokenObtainPairView):
    """
    Login view:
    - Sends access token in response body
    - Stores refresh token in HttpOnly cookie
    """

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if not isinstance(response.data, dict):
            response.data = {'detail': 'Invalid response format.'}
            response.status_code = status.HTTP_400_BAD_REQUEST
        elif response.status_code == status.HTTP_200_OK:
            access_token = str(response.data.get("access"))
            refresh_token = str(response.data.get("refresh"))
            cookie_secure = os.environ.get(
                "COOKIE_SECURE", "False") == "True"

            response.set_cookie(
                key=REFRESH_TOKEN_COOKIE_NAME,
                value=refresh_token,
                httponly=True,          # HttpOnly cookie
                secure=cookie_secure,   # only over HTTPS
                samesite="Lax",
                max_age=7*24*60*60,     # 7 days
            )

            response.data = {"access": access_token}

        return response


class CookieTokenRefreshView(APIView):
    """
    Refresh token view:
    - Expects refresh token in HttpOnly cookie
    - Returns new access token
    """

    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get(REFRESH_TOKEN_COOKIE_NAME)

        if not refresh_token:
            return Response({"detail": "Refresh token missing."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            return Response({"access": str(refresh.access_token)})
        except Exception:
            return Response({"detail": "Invalid refresh token."}, status=status.HTTP_401_UNAUTHORIZED)


class SignOutView(APIView):
    """
    Sign out view:
    - Deletes refresh token cookie
    """

    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        response = Response({"detail": "Signed out"},
                            status=status.HTTP_200_OK)
        response.delete_cookie(REFRESH_TOKEN_COOKIE_NAME)

        return response


class CustomUserViewSet(CompanyScopedViewSet):
    queryset = CustomUser.objects.all().order_by("-username")
    serializer_class = CustomUserSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["groups"]
    search_fields = ["username", "email"]
    ordering_fields = ["username"]
    pagination_class = AdjustableSizePagination


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me(request):
    serializer = CustomUserSerializer(request.user)
    return Response(serializer.data)

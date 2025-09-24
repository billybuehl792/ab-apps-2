import os
import logging

from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

from config.pagination import AdjustableSizePagination
from .serializers import CustomUserSerializer, MyTokenObtainPairSerializer, RegisterSerializer
from app.common.views import CompanyScopedViewSet
from app.account.models import CustomUser

REFRESH_TOKEN_COOKIE_NAME = "ab_refresh_token"

logger = logging.getLogger(__name__)


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class CookieTokenObtainPairView(TokenObtainPairView):
    """
    Login view:
    - Sends access token in response body
    - Stores refresh token in HttpOnly cookie
    """

    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if not isinstance(response.data, dict):
            response.data = {'detail': 'Invalid response format.'}
            response.status_code = status.HTTP_400_BAD_REQUEST
        elif response.status_code == status.HTTP_200_OK:
            access_token = str(response.data.get("access"))
            refresh_token = str(response.data.get("refresh"))
            cookie_secure = os.environ.get("COOKIE_SECURE", "False") == "True"

            me_id = response.data.get("user_id", None)
            try:
                if not me_id:
                    response.data = {
                        'detail': 'User ID not found in response.'}
                    response.status_code = status.HTTP_400_BAD_REQUEST
                    return response

                me = CustomUser.objects.get(id=me_id)
                response.set_cookie(
                    key=REFRESH_TOKEN_COOKIE_NAME,
                    value=refresh_token,
                    httponly=True,
                    secure=cookie_secure,
                    samesite="Lax",
                    max_age=7*24*60*60,  # 7 days
                )

                response.data = {
                    "access": access_token,
                    "me": CustomUserSerializer(me).data
                }

            except CustomUser.DoesNotExist:
                logger.warning(f"User with ID {me_id} not found during login")
                response.data = {'detail': 'User not found.'}
                response.status_code = status.HTTP_400_BAD_REQUEST
            except Exception as e:
                logger.error(f"Error occurred during login: {e}")
                response.data = {'detail': 'An error occurred during login.'}
                response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

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
            user_id = refresh.payload.get('user_id')

            if not user_id:
                return Response({"detail": "Invalid token payload."}, status=status.HTTP_401_UNAUTHORIZED)

            try:
                me = CustomUser.objects.get(id=user_id)
                return Response({
                    "access": str(refresh.access_token),
                    "me": CustomUserSerializer(me).data
                })
            except CustomUser.DoesNotExist:
                logger.warning(
                    f"User with ID {user_id} not found during token refresh")
                return Response({"detail": "User not found."}, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            logger.error(f"Error during token refresh: {e}")
            return Response({"detail": "Invalid refresh token."}, status=status.HTTP_401_UNAUTHORIZED)


class CookieTokenRevokeView(APIView):
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

    @action(detail=False, methods=("get",))
    def count(self, request: Request) -> Response:
        """Return the total count of users in the filtered queryset."""
        count = self.get_queryset().count()
        return Response({"count": count})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me(request):
    return Response(CustomUserSerializer(request.user).data)

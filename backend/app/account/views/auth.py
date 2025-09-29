import os
import logging

from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from app.account.models import CustomUser
from app.account.serializers.auth import MyTokenObtainPairSerializer
from app.account.serializers.auth import ChangePasswordSerializer
from app.account.serializers.users import CustomUserSerializer

REFRESH_TOKEN_COOKIE_NAME = "ab_refresh_token"

logger = logging.getLogger(__name__)


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


class ChangePasswordView(APIView):
    """
    Change password view:
    - Requires authentication
    - Validates current password
    - Updates user password
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={'request': request})

        if serializer.is_valid():
            try:
                serializer.save()
                logger.info(
                    f"Password changed successfully for user {request.user.username}")
                return Response(
                    {"detail": "Password changed successfully."},
                    status=status.HTTP_200_OK
                )
            except Exception as e:
                logger.error(
                    f"Error changing password for user {request.user.username}: {e}")
                return Response(
                    {"detail": "An error occurred while changing password."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me(request):
    return Response(CustomUserSerializer(request.user).data)

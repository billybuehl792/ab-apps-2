import os
import logging

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED, HTTP_500_INTERNAL_SERVER_ERROR
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView, settings
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
            response.status_code = HTTP_400_BAD_REQUEST
        elif response.status_code == HTTP_200_OK:
            access_token = str(response.data.get("access"))
            refresh_token = str(response.data.get("refresh"))
            cookie_secure = os.environ.get("COOKIE_SECURE", "False") == "True"

            me_id = response.data.get("user_id", None)
            try:
                if not me_id:
                    response.data = {
                        'detail': 'User ID not found in response.'}
                    response.status_code = HTTP_400_BAD_REQUEST
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
                response.status_code = HTTP_400_BAD_REQUEST
            except Exception as e:
                logger.error(f"Error occurred during login: {e}")
                response.data = {'detail': 'An error occurred during login.'}
                response.status_code = HTTP_500_INTERNAL_SERVER_ERROR

        return response


class CookieTokenRefreshView(APIView):
    """
    Refresh token view:
    - Expects refresh token in HttpOnly cookie
    - Returns new access token
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get(REFRESH_TOKEN_COOKIE_NAME)

        if not refresh_token:
            return Response({"detail": "Refresh token missing."}, status=HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            user_id = refresh.payload.get('user_id')

            if not user_id:
                return Response({"detail": "Invalid token payload."}, status=HTTP_401_UNAUTHORIZED)

            try:
                me = CustomUser.objects.get(id=user_id)
                return Response({
                    "access": str(refresh.access_token),
                    "me": CustomUserSerializer(me).data
                })
            except CustomUser.DoesNotExist:
                logger.warning(
                    f"User with ID {user_id} not found during token refresh")
                return Response({"detail": "User not found."}, status=HTTP_401_UNAUTHORIZED)

        except Exception as e:
            logger.error(f"Error during token refresh: {e}")
            return Response({"detail": "Invalid refresh token."}, status=HTTP_401_UNAUTHORIZED)


class CookieTokenRevokeView(APIView):
    """
    Sign out view:
    - Deletes refresh token cookie
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response({"detail": "Signed out"},
                            status=HTTP_200_OK)
        response.delete_cookie(REFRESH_TOKEN_COOKIE_NAME)

        return response


class ChangePasswordView(APIView):
    """
    Change password view:
    - Requires authentication
    - Validates current password
    - Updates user password
    """

    permission_classes = [IsAuthenticated]

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
                    status=HTTP_200_OK
                )
            except Exception as e:
                logger.error(
                    f"Error changing password for user {request.user.username}: {e}")
                return Response(
                    {"detail": "An error occurred while changing password."},
                    status=HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class RequestPasswordResetView(APIView):
    """
    Request password reset view:
    - Accepts email address
    - Generates reset token and sends email
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response(
                {"detail": "Email is required."},
                status=HTTP_400_BAD_REQUEST
            )

        try:
            user = CustomUser.objects.get(email=email)

            # Generate token
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            # Build reset link
            frontend_url = os.environ.get("FRONTEND_URL")
            if (not frontend_url):
                raise ValueError(
                    "FRONTEND_URL environment variable is not set")

            reset_link = f"{frontend_url}/reset-password/{uid}/{token}"

            # Send email
            send_mail(
                subject="Password Reset Request",
                message=f"Click the link to reset your password: {reset_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )

            logger.info(f"Password reset email sent to {email}")

        except CustomUser.DoesNotExist:
            # Don't reveal if user exists or not
            logger.warning(
                f"Password reset requested for non-existent email: {email}")
        except Exception as e:
            logger.error(f"Error sending password reset email: {e}")
            return Response(
                {"detail": "An error occurred while sending reset email."},
                status=HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Always return success to prevent email enumeration
        return Response(
            {"detail": "If the email exists, a reset link has been sent."},
            status=HTTP_200_OK
        )


class ResetPasswordView(APIView):
    """
    Reset password view:
    - GET: Validates token and uid
    - POST: Updates user password
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, uid, token):
        """
        Validate reset link without requiring a password.
        Returns 200 if valid, 400 if invalid/expired.
        """
        try:
            # Decode uid
            user_id = force_str(urlsafe_base64_decode(uid))
            user = CustomUser.objects.get(pk=user_id)

            # Validate token
            token_generator = PasswordResetTokenGenerator()
            if not token_generator.check_token(user, token):
                return Response(
                    {"detail": "Invalid or expired reset link."},
                    status=HTTP_400_BAD_REQUEST
                )

            return Response(
                {"detail": "Reset link is valid."},
                status=HTTP_200_OK
            )

        except (CustomUser.DoesNotExist, ValueError, TypeError):
            return Response(
                {"detail": "Invalid reset link."},
                status=HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error validating reset link: {e}")
            return Response(
                {"detail": "An error occurred while validating reset link."},
                status=HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, uid, token):
        new_password = request.data.get('new_password')

        if not new_password:
            return Response(
                {"detail": "New password is required."},
                status=HTTP_400_BAD_REQUEST
            )

        try:
            # Decode uid
            user_id = force_str(urlsafe_base64_decode(uid))
            user = CustomUser.objects.get(pk=user_id)

            # Validate token
            token_generator = PasswordResetTokenGenerator()
            if not token_generator.check_token(user, token):
                return Response(
                    {"detail": "Invalid or expired reset link."},
                    status=HTTP_400_BAD_REQUEST
                )

            # Update password
            user.set_password(new_password)
            user.save()

            logger.info(
                f"Password reset successfully for user {user.username}")

            return Response(
                {"detail": "Password reset successfully."},
                status=HTTP_200_OK
            )

        except (CustomUser.DoesNotExist, ValueError, TypeError):
            return Response(
                {"detail": "Invalid reset link."},
                status=HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error resetting password: {e}")
            return Response(
                {"detail": "An error occurred while resetting password."},
                status=HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(CustomUserSerializer(request.user).data)

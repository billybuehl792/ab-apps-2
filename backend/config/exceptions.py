from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.views import Response, exception_handler
from rest_framework import status
from rest_framework.exceptions import ValidationError as DRFValidationError
from app.places.services.exceptions import GooglePlacesError


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if isinstance(exc, GooglePlacesError):
        return Response(
            {"detail": str(exc)},
            status=status.HTTP_404_NOT_FOUND,
        )

    return response

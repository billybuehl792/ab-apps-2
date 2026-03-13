from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError as DRFValidationError


def custom_exception_handler(exc, context):
    if isinstance(exc, DjangoValidationError):
        detail = exc.message_dict if hasattr(exc, 'message_dict') else exc.messages

        # Flatten model-level (__all__) errors into a plain detail string
        if isinstance(detail, dict) and list(detail.keys()) == ['__all__']:
            detail = detail['__all__'][0] if len(detail['__all__']) == 1 else detail['__all__']

        exc = DRFValidationError(detail=detail)

    return exception_handler(exc, context)
from rest_framework.exceptions import PermissionDenied
from django.http import HttpRequest

from app.companies.models import Company


def get_user_company_from_request(request: HttpRequest) -> Company | None:
    """Extract the company associated with the user from the request."""
    return getattr(request.user, 'company', None) if request.user else None


def get_user_company_from_request_or_raise(request: HttpRequest) -> Company:
    """Get the user's company or raise a PermissionDenied error if not found."""
    company = get_user_company_from_request(request)
    if not company:
        raise PermissionDenied(
            "User must be associated with a company to perform this action.")
    return company


def get_user_company_from_context(context: dict) -> Company | None:
    """Extract the company associated with the user from the serializer context."""
    request = context.get('request')
    if request and hasattr(request.user, 'company'):
        return request.user.company
    return None


def get_user_company_from_context_or_raise(context: dict) -> Company:
    """Get the user's company from context or raise a PermissionDenied error if not found."""
    company = get_user_company_from_context(context)
    if not company:
        raise PermissionDenied(
            "User must be associated with a company to perform this action.")
    return company

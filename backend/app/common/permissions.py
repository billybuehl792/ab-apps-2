from rest_framework.permissions import BasePermission
from django.http import HttpRequest

from .services.utils import get_user_company_from_request


class IsFromCompany(BasePermission):
    """
    Custom permission to only allow users to access resources 
    that belong to their company.
    """

    message = "You can only access resources from your own company."

    def has_permission(self, request: HttpRequest, view) -> bool:  # type: ignore
        """
        Check if user is authenticated and has a company.
        """
        if not request.user or not request.user.is_authenticated:
            return False

        # Check if user has a company
        company = get_user_company_from_request(request)
        return company is not None

    def has_object_permission(self, request: HttpRequest, view, obj) -> bool:  # type: ignore
        """
        Check if the object belongs to the user's company.
        """
        if not request.user or not request.user.is_authenticated:
            return False

        user_company = get_user_company_from_request(request)
        if not user_company:
            return False

        # Check if object has a company attribute
        obj_company = getattr(obj, 'company', None)

        return obj_company == user_company

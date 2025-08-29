from rest_framework.permissions import BasePermission

from app.account.models import RoleEnum


class IsAdminOnly(BasePermission):
    """
    Allows access only to users with admin roles.
    Usage: permission_classes = [IsAdminOnly]
    """

    allowed_roles = [RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN]

    def has_permission(self, request, view):  # type: ignore
        user = request.user
        return (
            user.is_authenticated and
            user.role and
            user.role in self.allowed_roles
        )


class IsFromCompany(BasePermission):
    """
    Allows access only to objects belonging to the user's company.
    Blocks all actions if user has no company.
    """

    def has_permission(self, request, view):  # type: ignore
        user_company = getattr(request.user, 'company', None)
        return bool(user_company)

    def has_object_permission(self, request, view, obj):  # type: ignore
        user_company = getattr(request.user, 'company', None)
        object_company = getattr(obj, 'company', None)
        return bool(user_company) and bool(object_company) and object_company == user_company

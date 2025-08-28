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
    """

    def has_object_permission(self, request, view, obj):  # type: ignore
        print('in obj permissions', request.user, obj)
        user_company = getattr(request.user, 'company', None)
        return bool(user_company) and obj.company == user_company

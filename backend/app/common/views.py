from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated


class CompanyScopedViewSet(viewsets.ModelViewSet):
    """
    Base viewset that restricts queryset and enforces company ownership.
    Raises errors if the authenticated user has no company.
    Assumes models have a `company` FK and users have a `company` attr.
    """

    permission_classes = [IsAuthenticated]

    def get_user_company(self):
        company = getattr(self.request.user, "company", None)
        if company is None:
            raise PermissionDenied("User does not belong to a company.")
        return company

    def get_queryset(self):
        qs = super().get_queryset()
        user_company = getattr(self.request.user, "company", None)
        if user_company is None:
            raise PermissionDenied("User does not belong to a company.")
        return qs.filter(company=user_company)

    def perform_create(self, serializer):
        company = self.get_user_company()
        serializer.save(company=company)

    def perform_update(self, serializer):
        company = self.get_user_company()
        serializer.save(company=company)

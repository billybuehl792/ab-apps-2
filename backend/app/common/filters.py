from typing import Any, List

from django_filters import BaseInFilter, CharFilter
from django.db.models import Q, QuerySet


class ListInFilter(BaseInFilter, CharFilter):
    """Filter that accepts multiple values for a field via query parameters."""

    def filter(self, qs: QuerySet, value: Any) -> QuerySet:
        values = self._get_request_values()
        return super().filter(qs, values) if values else qs

    def _get_request_values(self) -> List[str]:
        """Extract values from request parameters."""
        parent = getattr(self, 'parent', None)
        if not parent or not hasattr(parent, 'request'):
            return []
        return parent.request.GET.getlist(self.field_name)


class CaseInsensitiveListInFilter(ListInFilter):
    """Filter that accepts multiple case-insensitive values for a field."""

    def filter(self, qs: QuerySet, value: Any) -> QuerySet:
        values = self._get_request_values()

        if not values:
            return qs

        # Use __iexact with single query for better performance
        clean_values = [v.strip() for v in values if v.strip()]

        if not clean_values:
            return qs

        # For case-insensitive IN lookup, use __iexact with Q objects
        query = Q()
        lookup = f"{self.field_name}__iexact"

        for value in clean_values:
            query |= Q(**{lookup: value})

        return qs.filter(query)

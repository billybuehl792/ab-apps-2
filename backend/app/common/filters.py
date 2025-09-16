import django_filters
from django.db.models import Q


class ListInFilter(django_filters.BaseInFilter, django_filters.CharFilter):
    def filter(self, qs, value):
        values = self.parent.request.GET.getlist(  # type: ignore
            self.field_name)

        return qs if not values else super().filter(qs, values)


class CaseInsensitiveListInFilter(django_filters.BaseInFilter, django_filters.CharFilter):
    def filter(self, qs, value):
        values = self.parent.request.GET.getlist(  # type: ignore
            self.field_name)
        if not values:
            return qs

        query = Q()
        for v in values:
            query |= Q(**{f"{self.field_name}__iexact": v})

        return qs.filter(query)

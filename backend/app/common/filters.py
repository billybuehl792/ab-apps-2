import django_filters


class ListInFilter(django_filters.BaseInFilter, django_filters.CharFilter):
    def filter(self, qs, value):
        values = self.parent.request.GET.getlist(  # type: ignore
            self.field_name)

        return qs if not values else super().filter(qs, values)

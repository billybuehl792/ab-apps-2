from django_filters import BaseInFilter, BooleanFilter, FilterSet

from .models import Job


class JobsFilter(FilterSet):
    """Filter set for `Job` model."""

    recipients = BaseInFilter(field_name="recipients__id",
                              lookup_expr="in", distinct=True)
    assignees = BaseInFilter(field_name="assignees__id",
                             lookup_expr="in", distinct=True)
    place = BaseInFilter(field_name="place__id",
                         lookup_expr="in", distinct=True)
    city = BaseInFilter(field_name="place__city",
                        lookup_expr="in", distinct=True)
    status = BaseInFilter(field_name="status",
                          lookup_expr="in", distinct=True)

    class Meta:
        model = Job
        fields = ("place", "recipients", "assignees", "city", "status")

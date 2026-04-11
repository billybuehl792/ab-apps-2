from django_filters import BaseInFilter, FilterSet, CharFilter

from .models import Job


class JobsFilter(FilterSet):
    """Filter set for `Job` model."""

    completed = CharFilter(field_name="completed",
                           lookup_expr="isnull", exclude=True)
    scheduled = CharFilter(field_name="scheduled",
                           lookup_expr="isnull", exclude=True)
    place = BaseInFilter(field_name="place__id",
                         lookup_expr="in", distinct=True)
    recipient = BaseInFilter(field_name="recipient__id",
                             lookup_expr="in", distinct=True)
    assignee = BaseInFilter(field_name="assignee__id",
                            lookup_expr="in", distinct=True)

    class Meta:
        model = Job
        fields = ("place", "recipient", "assignee",
                  "completed", "scheduled")

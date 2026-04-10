from django_filters import BaseInFilter, FilterSet, CharFilter

from .models import Job


class JobsFilter(FilterSet):
    """Filter set for `Job` model."""

    completed_at = CharFilter(field_name="completed_at",
                              lookup_expr="isnull", exclude=True)
    scheduled_at = CharFilter(field_name="scheduled_at",
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
                  "completed_at", "scheduled_at")

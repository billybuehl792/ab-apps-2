from django_filters import FilterSet

from app.work_orders.models import WorkOrder
from app.common.filters import CaseInsensitiveListInFilter, ListInFilter


class WorkOrderFilter(FilterSet):
    """Filter set for `WorkOrder` model with `client`, `status`, and `city` filtering."""

    client = ListInFilter(
        field_name="client",
        lookup_expr="in",
        help_text="Filter by client IDs"
    )
    status = ListInFilter(
        field_name="status",
        lookup_expr="in",
        help_text="Filter by work order status"
    )
    place__city = CaseInsensitiveListInFilter(
        field_name="place__city",
        lookup_expr="in",
        help_text="Filter by city names (case insensitive)"
    )

    class Meta:
        model = WorkOrder
        fields = ("status", "client", "place__city")

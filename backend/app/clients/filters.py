from django_filters import FilterSet

from .models import Client
from app.common.filters import CaseInsensitiveListInFilter, ListInFilter


class ClientFilter(FilterSet):
    """Filter set for `Client` model with `city` and `work_order__status` filtering."""

    place__city = CaseInsensitiveListInFilter(
        field_name="place__city",
        lookup_expr="in",
        help_text="Filter by city names (case insensitive)"
    )
    work_orders__status = ListInFilter(
        field_name="work_orders__status",
        lookup_expr="in",
        help_text="Filter by work order status"
    )

    class Meta:
        model = Client
        fields = ("place__city", "work_orders__status")

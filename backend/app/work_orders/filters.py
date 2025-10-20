from django_filters import CharFilter, FilterSet, NumberFilter

from app.work_orders.models import WorkOrder


class WorkOrderFilter(FilterSet):
    """Filter set for `WorkOrder` model with `client`, `status`, and `city` filtering."""

    client = NumberFilter(field_name="client__id")
    status = CharFilter(field_name="status")
    city = CharFilter(field_name="place__city", lookup_expr="iexact")

    class Meta:
        model = WorkOrder
        fields = ("status", "client", "city")

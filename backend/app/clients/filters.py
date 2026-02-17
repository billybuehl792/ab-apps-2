from django_filters import FilterSet, CharFilter

from .models import Client


class ClientFilter(FilterSet):
    """Filter set for `Client` model with `city` and `work_order__status` filtering."""

    city = CharFilter(field_name="place__city", lookup_expr="iexact")
    work_order_status = CharFilter(field_name="work_orders__status")

    class Meta:
        model = Client
        fields = ("city", "work_order_status")

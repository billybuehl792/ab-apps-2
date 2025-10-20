from django_filters import FilterSet, CharFilter

from .models import Client


class ClientFilter(FilterSet):
    """Filter set for `Client` model with `city` and `work_order__status` filtering."""

    place__city = CharFilter(field_name="place__city", lookup_expr="iexact")
    work_orders__status = CharFilter(field_name="work_orders__status")

    class Meta:
        model = Client
        fields = ("place__city", "work_orders__status")

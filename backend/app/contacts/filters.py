from django_filters import BaseInFilter, FilterSet, CharFilter,  NumberFilter

from .models import Contact


class ContactsFilter(FilterSet):
    """Filter set for `Contact` model with `city` filtering."""

    tag = BaseInFilter(field_name="tags__id", lookup_expr="in", distinct=True)
    city = CharFilter(field_name="place__city", lookup_expr="iexact")

    class Meta:
        model = Contact
        fields = ("city", "tag")

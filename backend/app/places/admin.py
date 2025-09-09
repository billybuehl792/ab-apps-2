from django.contrib import admin

from .models import Place


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ("id", "address_full", "company")
    list_filter = ("company", "country", "state", "city")
    search_fields = ("company", "country", "state", "city",
                     "postal_code", "address_full", "address_short")

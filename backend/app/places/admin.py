from django.contrib import admin

from .models import Place


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ("id", "google_place_id", "address_full")
    list_filter = ("country", "state", "city")
    search_fields = ("country", "state", "city",
                     "postal_code", "address_full", "address_short")

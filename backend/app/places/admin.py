from django.contrib import admin

from .models import Place


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ("id", "google_place_id", "address_full")
    list_filter = ("country_code", "state_code", "city")
    search_fields = ("address_full",)

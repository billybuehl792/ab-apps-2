from django.contrib import admin

from .models import Place


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ("id", "street_address", "city", "state",
                    "country", "postal_code", "created_at", "updated_at")
    list_filter = ("country", "state", "city")
    search_fields = ("street_address", "city")

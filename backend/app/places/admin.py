from django.contrib import admin

from .models import Place


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ("id", "company", "country", "state", "city", "postal_code",
                    "address_full", "address_short", "latitude", "longitude", "created_at")
    list_filter = ("company",)
    search_fields = ("company", "country", "state", "city",
                     "postal_code", "address_full", "address_short")

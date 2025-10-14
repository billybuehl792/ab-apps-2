from django.contrib import admin

from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "file", "thumbnail", "created_at",
                    "updated_at", "company")
    list_filter = ("company",)
    search_fields = ("label",)

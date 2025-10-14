from django.contrib.admin import ModelAdmin, register

from .models import Company


@register(Company)
class CompanyAdmin(ModelAdmin):
    list_display = ("id", "label", "description", "created_at")
    search_fields = ("label",)

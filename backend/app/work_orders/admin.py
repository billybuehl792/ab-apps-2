from django.contrib import admin

from .models import WorkOrder


@admin.register(WorkOrder)
class WorkOrderAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "client", "status", "cost",
                    "scheduled_date", "completed_date", "place", "company")
    list_filter = ("company", "client", "status")
    search_fields = ("label", "client__first_name", "client__last_name")

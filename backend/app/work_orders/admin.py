from django.contrib import admin

from .models import WorkOrder


@admin.register(WorkOrder)
class WorkOrderAdmin(admin.ModelAdmin):
    list_display = ("id", "company", "label", "client", "status", "cost",
                    "scheduled_date", "completed_date", "created_at")
    list_filter = ("status",)
    search_fields = ("label", "company", "client__first_name",
                     "client__last_name", "client__email")

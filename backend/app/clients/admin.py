from django.contrib import admin

from .models import Client
from app.work_orders.models import WorkOrder


class WorkOrderInline(admin.TabularInline):
    model = WorkOrder
    extra = 0  # No extra blank forms


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("id", "first_name", "last_name",
                    "email", "phone_primary", "place", "work_orders", "company")
    list_filter = ("company",)
    search_fields = ("first_name", "last_name", "email", "phone_primary")
    inlines = [WorkOrderInline]

    @admin.display(description="Work Orders")
    def work_orders(self, obj):
        return ", ".join([f"{str(wo.id)}: {wo.label}" for wo in obj.work_orders.all()])

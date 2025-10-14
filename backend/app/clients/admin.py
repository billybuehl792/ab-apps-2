from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline

from .models import Client
from app.work_orders.models import WorkOrder
from app.documents.models import Document


class DocumentInline(GenericTabularInline):
    model = Document
    extra = 0  # No extra blank forms


class WorkOrderInline(admin.TabularInline):
    model = WorkOrder
    extra = 0  # No extra blank forms


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "first_name", "last_name",
                    "email", "phone_primary", "place", "work_orders", "company")
    list_filter = ("company",)
    search_fields = ("first_name", "last_name", "email", "phone_primary")
    inlines = [DocumentInline, WorkOrderInline]

    @admin.display(description="Work Orders")
    def work_orders(self, obj):
        return ", ".join([str(wo.id)for wo in obj.work_orders.all()])

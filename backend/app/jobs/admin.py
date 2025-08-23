from django.contrib import admin
from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "client", "status",
                    "scheduled_date", "completed_date", "cost", "created_at")
    list_filter = ("status",)
    search_fields = ("title", "client__first_name",
                     "client__last_name", "client__email")

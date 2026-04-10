from django.contrib import admin

from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "assignee", "recipient",
                    "place", "scheduled_at", "completed_at")
    list_filter = ("assignee", "recipient", "place",
                   "scheduled_at", "completed_at")
    search_fields = ("label", "description", "assignee__first_name", "assignee__last_name",
                     "recipient__first_name", "recipient__last_name", "place__address_full")

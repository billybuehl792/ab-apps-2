from django.contrib import admin

from .models import Job, JobComment


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("id", "description_preview", "assignees_list", "recipients_list",
                    "place", "scheduled_at", "completed_at")
    list_filter = ("assignees", "recipients", "place",
                   "scheduled_at", "completed_at")
    search_fields = ("description", "assignees__first_name", "assignees__last_name",
                     "recipients__first_name", "recipients__last_name", "place__address_full")

    @admin.display(description="Description")
    def description_preview(self, obj):
        return (obj.description[:75] + "...") if len(obj.description) > 75 else obj.description

    @admin.display(description="Assignees")
    def assignees_list(self, obj):
        return ", ".join(str(contact) for contact in obj.assignees.all())

    @admin.display(description="Recipients")
    def recipients_list(self, obj):
        return ", ".join(str(contact) for contact in obj.recipients.all())


@admin.register(JobComment)
class JobCommentAdmin(admin.ModelAdmin):
    list_display = ("id", "job", "content", "created_by",
                    "updated_by", "created_at", "updated_at")
    list_filter = ("created_by", "updated_by", "created_at", "updated_at")
    search_fields = ("content", "created_by__username", "updated_by__username")

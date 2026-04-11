from django.contrib import admin

from .models import Job, JobCategory, JobComment


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "assignee", "recipient",
                    "place", "scheduled_at", "completed_at")
    list_filter = ("assignee", "recipient", "place",
                   "scheduled_at", "completed_at")
    search_fields = ("label", "description", "assignee__first_name", "assignee__last_name",
                     "recipient__first_name", "recipient__last_name", "place__address_full")


@admin.register(JobCategory)
class JobCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "description")
    search_fields = ("label", "description")


@admin.register(JobComment)
class JobCommentAdmin(admin.ModelAdmin):
    list_display = ("id", "job", "content", "created_by",
                    "updated_by", "created_at", "updated_at")
    list_filter = ("created_by", "updated_by", "created_at", "updated_at")
    search_fields = ("content", "created_by__username", "updated_by__username")

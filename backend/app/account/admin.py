from django.contrib import admin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "first_name",
                    "last_name", "role", "company", "is_active", "is_staff")
    list_filter = ("role",)
    search_fields = ("email", "first_name", "last_name", "username")

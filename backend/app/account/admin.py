from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    add_form = UserCreationForm
    form = UserChangeForm
    model = CustomUser
    list_display = ("id", "username", "email", "first_name",
                    "last_name", "is_active", "is_staff", "display_groups", "display_permissions")
    list_filter = ("groups",)
    search_fields = ("email", "first_name", "last_name", "username")

    fieldsets = UserAdmin.fieldsets

    @admin.display(description="Groups")
    def display_groups(self, obj):
        return ", ".join([g.name for g in obj.groups.all()])

    @admin.display(description="User Permissions")
    def display_permissions(self, obj):
        return ", ".join([p.codename for p in obj.user_permissions.all()])

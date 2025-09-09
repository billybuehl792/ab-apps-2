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
                    "last_name", "company", "is_active", "is_staff", "display_groups", "display_permissions")
    list_filter = ("company", "groups")
    search_fields = ("email", "first_name", "last_name", "username")

    fieldsets = UserAdmin.fieldsets + (
        (None, {"fields": ("company",)}),
    )  # type: ignore
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {"fields": ("company",)}),
    )

    @admin.display(description="Groups")
    def display_groups(self, obj):
        return ", ".join([g.name for g in obj.groups.all()])

    @admin.display(description="User Permissions")
    def display_permissions(self, obj):
        return ", ".join([p.codename for p in obj.user_permissions.all()])

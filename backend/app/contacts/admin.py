from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline

from .models import Contact, ContactTag
from app.documents.models import Document


class DocumentInline(GenericTabularInline):
    model = Document
    extra = 0  # No extra blank forms


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ("id", "first_name", "last_name",
                    "email", "phone_primary", "place")
    search_fields = ("first_name", "last_name", "email", "phone_primary")
    inlines = [DocumentInline]


@admin.register(ContactTag)
class ContactTagAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "description", "color")
    search_fields = ("label", "description", "color")

import mimetypes
import os
import uuid

from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

from app.common.models import TimeStampedModel
from app.companies.models import Company

User = get_user_model()


def document_upload_to(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join("documents/", filename)


def thumbnail_upload_to(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join("documents/thumbnails/", filename)


class Document(TimeStampedModel):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="documents")
    uploaded_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)
    label = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to=document_upload_to)
    thumbnail = models.FileField(
        upload_to=thumbnail_upload_to, blank=True, null=True, editable=False)
    original_filename = models.CharField(
        max_length=255, blank=True, editable=False)
    mime_type = models.CharField(max_length=255, blank=True, editable=False)

    content_type = models.ForeignKey(
        ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:  # type: ignore
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

    def save(self, *args, **kwargs):
        if self.file:
            if not self.original_filename:
                self.original_filename = os.path.basename(self.file.name)
            mime, _ = mimetypes.guess_type(self.file.name)
            self.mime_type = mime or ""
        super().save(*args, **kwargs)

    def __str__(self):
        return self.label or self.file.name

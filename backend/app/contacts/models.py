from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.contenttypes.fields import GenericRelation

from app.common.models import PhoneNumberField, TimeStampedModel
from app.documents.models import Document
from app.places.models import Place


class Contact(TimeStampedModel):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_primary = PhoneNumberField()
    phone_secondary = PhoneNumberField(blank=True, null=True)
    place = models.ForeignKey(
        Place,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="contacts",
    )
    documents = GenericRelation(Document, related_query_name='contact')
    tags = models.ManyToManyField(
        'ContactTag', related_name='contacts', blank=True)

    class Meta:  # type: ignore
        constraints = [
            models.UniqueConstraint(
                fields=['first_name', 'last_name'],
                name='unique_contact_name'
            )
        ]
        verbose_name = 'Contact'
        verbose_name_plural = 'Contacts'
        ordering = ('last_name', 'first_name')

    def _clean_names(self):
        """Clean and validate name fields."""
        for field_name in ['first_name', 'last_name']:
            value = getattr(self, field_name, '')
            if value:
                cleaned_value = value.strip()
                if not cleaned_value:
                    raise ValidationError({
                        field_name: f'{field_name.replace("_", " ").title()} cannot be empty or whitespace only.'
                    })
                setattr(self, field_name, cleaned_value)

    def _normalize_names(self):
        """Normalize names to title case."""
        for field_name in ['first_name', 'last_name']:
            value = getattr(self, field_name, '')
            if value:
                setattr(self, field_name, value.title())

    def clean(self):
        """Validate model data before saving."""
        super().clean()
        self._clean_names()

    def save(self, *args, **kwargs):
        """Override save to auto-populate computed fields."""
        self.full_clean()
        self._normalize_names()
        super().save(*args, **kwargs)

    def add_document(self, **kwargs):
        """Helper method to create a document for this contact."""
        return Document.objects.create(content_object=self, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} <{self.email}>"


class ContactTag(TimeStampedModel):
    label = models.CharField(max_length=255, unique=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    color = models.CharField(max_length=7, blank=True, null=True)

    class Meta:  # type: ignore
        verbose_name = "Contact Tag"
        verbose_name_plural = "Contact Tags"
        ordering = ("label",)

    def __str__(self):
        return self.label

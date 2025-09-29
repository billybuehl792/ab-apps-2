from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

from app.companies.models import Company


class CustomUser(AbstractUser):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="users",
        null=True,
        blank=True,
    )
    full_name = models.CharField(max_length=511, editable=False)

    class Meta:
        unique_together = ('company', 'username')

    def clean(self):
        """Validate model data before saving."""
        super().clean()
        self._clean_names()

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

    def save(self, *args, **kwargs):
        """Override save to auto-populate computed fields."""
        self.full_clean()
        self._normalize_names()
        self._generate_full_name()
        super().save(*args, **kwargs)

    def _normalize_names(self):
        """Normalize names to title case."""
        for field_name in ['first_name', 'last_name']:
            value = getattr(self, field_name, '')
            if value:
                setattr(self, field_name, value.title())

    def _generate_full_name(self):
        """Generate full name from first and last name."""
        names = [name for name in [self.first_name, self.last_name] if name]
        self.full_name = ' '.join(names)

    def __str__(self):
        return self.username

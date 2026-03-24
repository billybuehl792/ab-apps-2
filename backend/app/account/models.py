from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError


class CustomUser(AbstractUser):
    full_name = models.CharField(max_length=511, editable=False)

    REQUIRED_FIELDS = ['email']

    class Meta:
        unique_together = ('username',)

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

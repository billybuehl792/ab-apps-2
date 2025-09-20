from django.db import models
from django.core.exceptions import ValidationError

from app.common.models import TimeStampedModel
from app.places.models import Place
from app.companies.models import Company


class Client(TimeStampedModel):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="clients",
        editable=False,
    )
    full_name = models.CharField(max_length=511, editable=False)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_primary = models.CharField(max_length=50)
    phone_secondary = models.CharField(max_length=50, blank=True, default="")
    place = models.ForeignKey(
        Place,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="clients",
    )

    class Meta:  # type: ignore
        constraints = [
            models.UniqueConstraint(
                fields=['company', 'first_name', 'last_name'],
                name='unique_client_name_per_company'
            )
        ]
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'
        ordering = ['last_name', 'first_name']

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
        return f"{self.full_name} <{self.email}>"

    @property
    def initials(self):
        """Return client's initials."""
        names = [self.first_name, self.last_name]
        initials = ''.join(name[0] for name in names if name)
        return initials.upper()

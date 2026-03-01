from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.core.exceptions import ValidationError

from app.companies.models import Company


class CustomUserManager(UserManager):
    def _company_obj(self, company):
        """Return a Company instance, or None."""
        if company is None:
            return None
        if isinstance(company, Company):
            return company
        # allow passing a PK/string from the cli
        return Company.objects.get(pk=company)

    def create_user(self, username, email=None, password=None, company=None,
                    **extra_fields):
        company = self._company_obj(company)
        if company is None:
            raise ValueError('Users must be associated with a company.')
        return super().create_user(username, email, password,
                                   company=company, **extra_fields)

    def create_superuser(self, username, email=None, password=None,
                         company=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        company = self._company_obj(company)
        if company is None:
            raise ValueError(
                'Superusers must have a company; either pass '
                '"--company=<pk>" or create one before running the command.'
            )
        return self.create_user(username, email, password,
                                company=company, **extra_fields)


class CustomUser(AbstractUser):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="users")
    full_name = models.CharField(max_length=511, editable=False)

    objects = CustomUserManager()

    REQUIRED_FIELDS = ['email', 'company']

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

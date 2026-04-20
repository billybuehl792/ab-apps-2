import re
from django.db.models import CharField, Model, DateTimeField
from django.forms import ValidationError


class TimeStampedModel(Model):
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class PhoneNumberField(CharField):
    """Reusable phone number field with validation and formatting."""

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('max_length', 20)
        super().__init__(*args, **kwargs)

    def clean(self, value, model_instance):
        value = super().clean(value, model_instance)
        if value:
            digits = re.sub(r'\D', '', value)
            if len(digits) == 11 and digits[0] != '0':
                country_code = digits[0]
                local = digits[1:]
                value = f'+{country_code} ({local[:3]}) {local[3:6]}-{local[6:]}'
            elif len(digits) == 10:
                value = f'({digits[:3]}) {digits[3:6]}-{digits[6:]}'
            else:
                raise ValidationError(
                    'Enter a valid 10-digit phone number, with optional country code.')
        return value

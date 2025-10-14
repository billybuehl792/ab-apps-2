import re
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.password_validation import validate_password
from rest_framework.serializers import ValidationError

from app.account.models import CustomUser


def validate_password_strength(password: str, user: CustomUser | None = None):
    """
    Validate password strength with Django built-in validators and custom rules.

    Args:
        password (str): The password to validate
        user (User, optional): User instance for context-aware validation

    Raises:
        ValidationError: If password doesn't meet requirements
    """
    # Use Django's built-in password validators
    try:
        validate_password(password, user=user)
    except DjangoValidationError as e:
        raise ValidationError(list(e.messages))

    # Additional custom validations
    if len(password) < 8:
        raise ValidationError(
            "Password must be at least 8 characters long.")

    if not re.search(r'[A-Z]', password):
        raise ValidationError(
            "Password must contain at least one uppercase letter.")

    if not re.search(r'[a-z]', password):
        raise ValidationError(
            "Password must contain at least one lowercase letter.")

    if not re.search(r'\d', password):
        raise ValidationError(
            "Password must contain at least one number.")

    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        raise ValidationError(
            "Password must contain at least one special character.")

    return password


def validate_password_change(new_password: str, current_user: CustomUser):
    """
    Validate password change including strength and uniqueness.

    Args:
        new_password (str): The new password
        current_user (User): The user changing their password

    Raises:
        ValidationError: If validation fails
    """
    # Validate password strength
    validate_password_strength(new_password, user=current_user)

    # Check if new password is different from current password
    if current_user and current_user.check_password(new_password):
        raise ValidationError(
            "New password must be different from current password.")

    return new_password

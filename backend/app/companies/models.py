from django.db import models

from app.common.models import Place, TimeStampedModel


class Company(TimeStampedModel):
    label = models.CharField(max_length=255)
    description = models.TextField()
    place = models.ForeignKey(
        Place,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="companies",
    )

    class Meta(object):  # type: ignore
        verbose_name = "Company"
        verbose_name_plural = "Companies"

    def __str__(self):
        return f"{self.label} <{self.description}>"

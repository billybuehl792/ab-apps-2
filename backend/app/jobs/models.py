from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericRelation
from simple_history.models import HistoricalRecords


User = get_user_model()


class Job(models.Model):
    description = models.TextField()
    categories = models.JSONField(default=list, blank=True)

    place = models.ForeignKey(
        "places.Place", blank=True, null=True, on_delete=models.SET_NULL, related_name="jobs")

    recipients = models.ManyToManyField(
        "contacts.Contact", blank=True, related_name="jobs_recipients")
    referred_by = models.ManyToManyField(
        "contacts.Contact", blank=True, related_name="jobs_referred_by")
    representatives = models.ManyToManyField(
        "contacts.Contact", blank=True, related_name="jobs_representatives")
    assignees = models.ManyToManyField(
        "contacts.Contact", blank=True, related_name="jobs_assignees")

    signed_at = models.DateTimeField(null=True, blank=True)
    estimated_at = models.DateTimeField(null=True, blank=True)
    sold_at = models.DateTimeField(null=True, blank=True)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    invoiced_at = models.DateTimeField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    paid = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)

    documents = GenericRelation("documents.Document")

    created_by = models.ForeignKey(
        User, blank=True, null=True, on_delete=models.SET_NULL, related_name="jobs_created", editable=False)
    updated_by = models.ForeignKey(
        User, blank=True, null=True, on_delete=models.SET_NULL, related_name="jobs_updated", editable=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)

    history = HistoricalRecords()

    class Meta:
        verbose_name = "Job"
        verbose_name_plural = "Jobs"


class JobComment(models.Model):
    job = models.ForeignKey(
        Job, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()

    created_by = models.ForeignKey(
        User, blank=True, null=True, on_delete=models.SET_NULL, related_name="job_comments_created", editable=False)
    updated_by = models.ForeignKey(
        User, blank=True, null=True, on_delete=models.SET_NULL, related_name="job_comments_updated", editable=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)

    history = HistoricalRecords()

    class Meta:
        verbose_name = "Job Comment"
        verbose_name_plural = "Job Comments"

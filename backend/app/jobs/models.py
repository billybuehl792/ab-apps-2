from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericRelation
from simple_history.models import HistoricalRecords

from app.common.models import TimeStampedModel


User = get_user_model()


class Job(TimeStampedModel):
    label = models.CharField(max_length=255, blank=True, default="")
    category = models.ForeignKey(
        "jobs.JobCategory", blank=True, null=True, on_delete=models.SET_NULL, related_name="jobs")
    description = models.TextField(blank=True, default="")
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    representative = models.ForeignKey(
        "contacts.Contact", blank=True, null=True, on_delete=models.SET_NULL, related_name="jobs_representative")
    assignee = models.ForeignKey(
        "contacts.Contact", blank=True, null=True, on_delete=models.SET_NULL, related_name="jobs_assignee")
    recipient = models.ForeignKey(
        "contacts.Contact", blank=True, null=True, on_delete=models.SET_NULL, related_name="jobs_recipient")
    referred_by = models.ForeignKey(
        "contacts.Contact", blank=True, null=True, on_delete=models.SET_NULL, related_name="jobs_referred_by")
    place = models.ForeignKey(
        "places.Place", blank=True, null=True, on_delete=models.SET_NULL, related_name="jobs")
    documents = GenericRelation("documents.Document")
    scheduled_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    history = HistoricalRecords()

    class Meta:  # type: ignore
        verbose_name = "Job"
        verbose_name_plural = "Jobs"


class JobCategory(TimeStampedModel):
    label = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, default="")

    def clean(self):
        self.label = self.label.strip().lower()

    class Meta:  # type: ignore
        verbose_name = "Job Category"
        verbose_name_plural = "Job Categories"


class JobComment(TimeStampedModel):
    job = models.ForeignKey(
        Job, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()
    created_by = models.ForeignKey(
        User, blank=True, null=True, on_delete=models.SET_NULL, related_name="job_comments_created")
    updated_by = models.ForeignKey(
        User, blank=True, null=True, on_delete=models.SET_NULL, related_name="job_comments_updated")
    history = HistoricalRecords()

    class Meta:  # type: ignore
        verbose_name = "Job Comment"
        verbose_name_plural = "Job Comments"


class JobExpense(TimeStampedModel):
    job = models.ForeignKey(
        Job, on_delete=models.CASCADE, related_name="expenses")
    label = models.CharField(max_length=255, blank=True, default="")
    category = models.CharField(max_length=255, blank=True, default="")
    description = models.CharField(max_length=255, blank=True, default="")
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    assignee = models.ForeignKey(
        "contacts.Contact", blank=True, null=True, on_delete=models.SET_NULL, related_name="job_expense_assignee")
    history = HistoricalRecords()

    class Meta:  # type: ignore
        verbose_name = "Job Expense"
        verbose_name_plural = "Job Expenses"

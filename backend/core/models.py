import secrets

from django.conf import settings
from django.db import models
from django.db.models import F, Sum
from django.utils import timezone


def generate_qr_token():
    """Short, URL-safe, collision-resistant token printed on the batch label."""
    return secrets.token_urlsafe(16)[:32]


class Farm(models.Model):
    name = models.CharField(max_length=255)
    name_ar = models.CharField(max_length=255, blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="farms"
    )
    location = models.CharField(max_length=255)
    location_ar = models.CharField(max_length=255, blank=True)
    photo = models.ImageField(upload_to="farms/", blank=True, null=True)
    photo_url = models.URLField(blank=True)
    story = models.TextField(blank=True)
    story_ar = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("name",)

    def __str__(self):
        return self.name

    @property
    def image(self):
        if self.photo:
            return self.photo.url
        return self.photo_url or ""


class Batch(models.Model):
    class Category(models.TextChoices):
        CROP = "crop", "Crop"
        ANIMAL = "animal", "Animal"

    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name="batches")
    crop_type = models.CharField(max_length=100)
    crop_type_ar = models.CharField(max_length=100, blank=True)
    category = models.CharField(
        max_length=10, choices=Category.choices, default=Category.CROP
    )
    description = models.TextField(blank=True)
    description_ar = models.TextField(blank=True)
    quantity_kg = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_share = models.DecimalField(
        max_digits=10, decimal_places=2, default=250,
        help_text="EGP charged to adopt one share of this batch.",
    )
    share_size_kg = models.DecimalField(
        max_digits=10, decimal_places=2, default=5,
        help_text="Kg delivered per adopted share.",
    )
    planted_date = models.DateField()
    expected_harvest_date = models.DateField()
    qr_code = models.CharField(
        max_length=64, unique=True, default=generate_qr_token, editable=False
    )
    photo = models.ImageField(upload_to="batches/", blank=True, null=True)
    photo_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name_plural = "batches"

    def __str__(self):
        return f"{self.crop_type} — {self.farm.name}"

    @property
    def image(self):
        if self.photo:
            return self.photo.url
        return self.photo_url or ""

    @property
    def growth_progress(self):
        """0–100 percentage of the way from planting to expected harvest."""
        total = (self.expected_harvest_date - self.planted_date).days
        if total <= 0:
            return 100
        elapsed = (timezone.now().date() - self.planted_date).days
        return max(0, min(100, round(elapsed / total * 100)))

    @property
    def shares_committed(self):
        agg = self.subscriptions.aggregate(total=Sum("quantity_committed"))
        return agg["total"] or 0

    @property
    def current_stage(self):
        last = self.events.order_by("-timestamp").first()
        return last.stage if last else None


class ConsumerSubscription(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="subscriptions"
    )
    batch = models.ForeignKey(
        Batch, on_delete=models.CASCADE, related_name="subscriptions"
    )
    quantity_committed = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        constraints = [
            models.UniqueConstraint(
                fields=("user", "batch"), name="unique_subscription_per_batch"
            )
        ]

    def __str__(self):
        return f"{self.user} → {self.batch}"


class TrackingEvent(models.Model):
    STAGE_CHOICES = [
        ("harvest", "Harvest"),
        ("cold_storage", "Cold Storage"),
        ("transport", "Transport"),
        ("market", "Market"),
        ("delivered", "Delivered"),
    ]
    STAGE_ORDER = [choice[0] for choice in STAGE_CHOICES]

    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name="events")
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES)
    quantity_ok = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_damaged = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    note = models.CharField(max_length=500, blank=True)
    photo_url = models.URLField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    location_ar = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ("timestamp",)

    def __str__(self):
        return f"{self.batch} · {self.stage}"

    @property
    def loss_pct(self):
        total = (self.quantity_ok or 0) + (self.quantity_damaged or 0)
        if total <= 0:
            return 0
        return round(float(self.quantity_damaged) / float(total) * 100, 1)

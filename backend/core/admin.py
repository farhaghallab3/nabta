from django.contrib import admin

from .models import Batch, ConsumerSubscription, Farm, TrackingEvent


class TrackingEventInline(admin.TabularInline):
    model = TrackingEvent
    extra = 0


@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "location")
    search_fields = ("name", "location")


@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = ("crop_type", "farm", "category", "expected_harvest_date", "qr_code")
    list_filter = ("category", "crop_type")
    search_fields = ("crop_type", "farm__name")
    inlines = [TrackingEventInline]


@admin.register(ConsumerSubscription)
class ConsumerSubscriptionAdmin(admin.ModelAdmin):
    list_display = ("user", "batch", "quantity_committed", "created_at")


@admin.register(TrackingEvent)
class TrackingEventAdmin(admin.ModelAdmin):
    list_display = ("batch", "stage", "quantity_ok", "quantity_damaged", "timestamp")
    list_filter = ("stage",)

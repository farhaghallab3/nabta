from django.contrib import admin

from .models import Batch, ConsumerSubscription, Farm, TrackingEvent


class TrackingEventInline(admin.TabularInline):
    model = TrackingEvent
    extra = 0


@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ("name", "name_ar", "owner", "location")
    search_fields = ("name", "name_ar", "location")


@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = ("crop_type", "crop_type_ar", "farm", "category", "expected_harvest_date")
    list_filter = ("category", "crop_type")
    search_fields = ("crop_type", "crop_type_ar", "farm__name")
    inlines = [TrackingEventInline]


@admin.register(ConsumerSubscription)
class ConsumerSubscriptionAdmin(admin.ModelAdmin):
    list_display = ("user", "batch", "quantity_committed", "created_at")


@admin.register(TrackingEvent)
class TrackingEventAdmin(admin.ModelAdmin):
    list_display = ("batch", "stage", "quantity_ok", "quantity_damaged", "timestamp")
    list_filter = ("stage",)

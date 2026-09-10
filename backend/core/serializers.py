from rest_framework import serializers

from .models import Batch, ConsumerSubscription, Farm, TrackingEvent
from .qr import qr_data_uri


class FarmSerializer(serializers.ModelSerializer):
    image = serializers.CharField(read_only=True)
    owner_name = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = Farm
        fields = (
            "id",
            "name",
            "location",
            "story",
            "photo_url",
            "image",
            "owner_name",
            "created_at",
        )
        read_only_fields = ("id", "created_at", "owner_name")


class TrackingEventSerializer(serializers.ModelSerializer):
    stage_display = serializers.CharField(source="get_stage_display", read_only=True)
    loss_pct = serializers.FloatField(read_only=True)

    class Meta:
        model = TrackingEvent
        fields = (
            "id",
            "batch",
            "stage",
            "stage_display",
            "quantity_ok",
            "quantity_damaged",
            "loss_pct",
            "note",
            "photo_url",
            "location",
            "timestamp",
        )
        read_only_fields = ("id", "batch", "stage_display", "loss_pct")


class BatchListSerializer(serializers.ModelSerializer):
    farm_name = serializers.CharField(source="farm.name", read_only=True)
    farm_location = serializers.CharField(source="farm.location", read_only=True)
    image = serializers.CharField(read_only=True)
    growth_progress = serializers.IntegerField(read_only=True)
    current_stage = serializers.CharField(read_only=True)
    shares_committed = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Batch
        fields = (
            "id",
            "crop_type",
            "category",
            "description",
            "farm",
            "farm_name",
            "farm_location",
            "qr_code",
            "quantity_kg",
            "price_per_share",
            "share_size_kg",
            "planted_date",
            "expected_harvest_date",
            "image",
            "photo_url",
            "growth_progress",
            "current_stage",
            "shares_committed",
            "created_at",
        )


class BatchDetailSerializer(BatchListSerializer):
    farm = FarmSerializer(read_only=True)
    events = TrackingEventSerializer(many=True, read_only=True)
    qr_image = serializers.SerializerMethodField()
    is_adopted = serializers.SerializerMethodField()

    class Meta(BatchListSerializer.Meta):
        fields = BatchListSerializer.Meta.fields + (
            "qr_image",
            "events",
            "is_adopted",
        )

    def get_qr_image(self, obj):
        return qr_data_uri(obj.qr_code)

    def get_is_adopted(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.subscriptions.filter(user=request.user).exists()


class BatchWriteSerializer(serializers.ModelSerializer):
    farm_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Batch
        fields = (
            "id",
            "farm",
            "farm_name",
            "crop_type",
            "category",
            "description",
            "quantity_kg",
            "price_per_share",
            "share_size_kg",
            "planted_date",
            "expected_harvest_date",
            "photo_url",
        )
        extra_kwargs = {"farm": {"required": False}}

    def validate(self, attrs):
        request = self.context["request"]
        farm = attrs.get("farm")
        farm_name = attrs.pop("farm_name", None)
        if farm is None and not farm_name:
            raise serializers.ValidationError(
                "Provide an existing farm or a farm_name to create one."
            )
        if farm is not None and farm.owner_id != request.user.id:
            raise serializers.ValidationError("You can only add batches to your own farm.")
        if farm is None:
            farm, _ = Farm.objects.get_or_create(
                owner=request.user,
                name=farm_name,
                defaults={"location": "Egypt"},
            )
            attrs["farm"] = farm
        if attrs["expected_harvest_date"] <= attrs["planted_date"]:
            raise serializers.ValidationError(
                "Expected harvest date must be after the planted date."
            )
        return attrs


class SubscriptionSerializer(serializers.ModelSerializer):
    batch_detail = BatchListSerializer(source="batch", read_only=True)
    events = serializers.SerializerMethodField()

    class Meta:
        model = ConsumerSubscription
        fields = (
            "id",
            "batch",
            "batch_detail",
            "quantity_committed",
            "events",
            "created_at",
        )
        read_only_fields = ("id", "created_at", "batch_detail", "events")

    def get_events(self, obj):
        return TrackingEventSerializer(obj.batch.events.all(), many=True).data


class AdoptSerializer(serializers.Serializer):
    quantity_committed = serializers.DecimalField(
        max_digits=10, decimal_places=2, min_value=1, default=1
    )

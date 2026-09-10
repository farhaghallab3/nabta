from django.db.models import Count, Prefetch, Sum
from rest_framework import decorators, generics, permissions, response, status, viewsets
from rest_framework.exceptions import ValidationError

from .models import Batch, ConsumerSubscription, Farm, TrackingEvent
from .permissions import IsConsumer, IsFarmer
from .serializers import (
    AdoptSerializer,
    BatchDetailSerializer,
    BatchListSerializer,
    BatchWriteSerializer,
    FarmSerializer,
    SubscriptionSerializer,
    TrackingEventSerializer,
)


class BatchViewSet(viewsets.ModelViewSet):
    queryset = (
        Batch.objects.select_related("farm", "farm__owner")
        .prefetch_related("events", "subscriptions")
        .all()
    )
    filterset_fields = ["category", "farm", "crop_type"]
    search_fields = ["crop_type", "farm__name", "farm__location", "description"]
    ordering_fields = ["created_at", "expected_harvest_date", "price_per_share"]

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [permissions.AllowAny()]
        if self.action == "adopt":
            return [IsConsumer()]
        if self.action == "track_event":
            return [IsFarmer()]
        return [IsFarmer()]

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return BatchWriteSerializer
        if self.action == "retrieve":
            return BatchDetailSerializer
        return BatchListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "list" and self.request.query_params.get("mine") == "1":
            return qs.filter(farm__owner=self.request.user)
        return qs

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        write = self.get_serializer(data=request.data)
        write.is_valid(raise_exception=True)
        batch = write.save()
        detail = BatchDetailSerializer(batch, context=self.get_serializer_context())
        return response.Response(detail.data, status=status.HTTP_201_CREATED)

    @decorators.action(detail=True, methods=["post"])
    def adopt(self, request, pk=None):
        batch = self.get_object()
        serializer = AdoptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscription, created = ConsumerSubscription.objects.get_or_create(
            user=request.user,
            batch=batch,
            defaults={"quantity_committed": serializer.validated_data["quantity_committed"]},
        )
        if not created:
            raise ValidationError("You have already adopted this batch.")
        return response.Response(
            SubscriptionSerializer(subscription).data, status=status.HTTP_201_CREATED
        )

    @decorators.action(detail=True, methods=["post"], url_path="track-event")
    def track_event(self, request, pk=None):
        batch = self.get_object()
        if batch.farm.owner_id != request.user.id:
            raise ValidationError("You can only log events for your own batches.")
        serializer = TrackingEventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        event = serializer.save(batch=batch)
        return response.Response(
            TrackingEventSerializer(event).data, status=status.HTTP_201_CREATED
        )


class MyAdoptionsView(generics.ListAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsConsumer]

    def get_queryset(self):
        return (
            ConsumerSubscription.objects.filter(user=self.request.user)
            .select_related("batch", "batch__farm")
            .prefetch_related("batch__events")
        )


class FarmerAnalyticsView(generics.GenericAPIView):
    permission_classes = [IsFarmer]

    def get(self, request):
        batches = Batch.objects.filter(farm__owner=request.user)
        events = TrackingEvent.objects.filter(batch__in=batches)

        by_stage = []
        for stage, label in TrackingEvent.STAGE_CHOICES:
            agg = events.filter(stage=stage).aggregate(
                ok=Sum("quantity_ok"), damaged=Sum("quantity_damaged")
            )
            ok = float(agg["ok"] or 0)
            damaged = float(agg["damaged"] or 0)
            total = ok + damaged
            by_stage.append(
                {
                    "stage": stage,
                    "label": label,
                    "quantity_ok": round(ok, 1),
                    "quantity_damaged": round(damaged, 1),
                    "loss_pct": round(damaged / total * 100, 1) if total else 0.0,
                }
            )

        total_damaged = float(events.aggregate(d=Sum("quantity_damaged"))["d"] or 0)
        total_ok = float(events.aggregate(o=Sum("quantity_ok"))["o"] or 0)
        grand_total = total_ok + total_damaged

        return response.Response(
            {
                "active_batches": batches.count(),
                "tracked_shipments": events.count(),
                "total_adoptions": ConsumerSubscription.objects.filter(
                    batch__in=batches
                ).count(),
                "overall_loss_pct": round(total_damaged / grand_total * 100, 1)
                if grand_total
                else 0.0,
                "by_stage": by_stage,
            }
        )


class FarmViewSet(viewsets.ModelViewSet):
    serializer_class = FarmSerializer

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [permissions.AllowAny()]
        return [IsFarmer()]

    def get_queryset(self):
        qs = (
            Farm.objects.select_related("owner")
            .annotate(batch_count=Count("batches"))
            .order_by("name")
        )
        if self.request.query_params.get("mine") == "1" and self.request.user.is_authenticated:
            return qs.filter(owner=self.request.user)
        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

"""Seed the database with a realistic Nabta demo dataset.

Run:  python manage.py seed          (idempotent-ish: wipes demo data first)
"""
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from core.models import Batch, ConsumerSubscription, Farm, TrackingEvent

User = get_user_model()

UNSPLASH = "https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w=1200&q=70"

FARMS = [
    {
        "name": "Wadi El Nil Organic",
        "location": "Fayoum, Egypt",
        "story": "A family farm on the shores of Lake Qarun growing tomatoes and "
        "peppers without synthetic pesticides for three generations.",
        "photo": UNSPLASH.format(id="1500937386664-56d1dfef3854"),
    },
    {
        "name": "Siwa Grove Collective",
        "location": "Siwa Oasis, Egypt",
        "story": "Twelve smallholder families pressing olive oil and packing dates "
        "from the desert oasis, sharing one cold store.",
        "photo": UNSPLASH.format(id="1445264718234-a623be589d37"),
    },
    {
        "name": "Nile Delta Poultry",
        "location": "Kafr El Sheikh, Egypt",
        "story": "Pasture-raised hens roaming between citrus rows, producing "
        "traceable free-range eggs for Cairo households.",
        "photo": UNSPLASH.format(id="1548550023-2bdb3c5beed7"),
    },
    {
        "name": "Beni Suef Beekeepers",
        "location": "Beni Suef, Egypt",
        "story": "Migratory hives following the clover and citrus bloom along the "
        "Nile, bottling raw unfiltered honey.",
        "photo": UNSPLASH.format(id="1587049352846-4a222e784d38"),
    },
]

BATCHES = [
    {
        "farm": 0,
        "crop_type": "Roma Tomatoes",
        "category": "crop",
        "description": "Vine-ripened Roma tomatoes, hand-picked at dawn and packed "
        "the same morning.",
        "quantity_kg": 1800,
        "price_per_share": 220,
        "share_size_kg": 5,
        "planted_days_ago": 74,
        "harvest_in_days": 12,
        "photo": UNSPLASH.format(id="1592841200221-a6898f307baa"),
        "events": [
            ("harvest", 620, 40, "Fayoum packing shed"),
            ("cold_storage", 600, 20, "On-farm cold store, 8°C"),
            ("transport", 580, 20, "Refrigerated van → Cairo"),
        ],
    },
    {
        "farm": 1,
        "crop_type": "Picual Olives",
        "category": "crop",
        "description": "First cold-press extra virgin olives from century-old Siwa "
        "trees.",
        "quantity_kg": 2400,
        "price_per_share": 480,
        "share_size_kg": 4,
        "planted_days_ago": 182,
        "harvest_in_days": 8,
        "photo": UNSPLASH.format(id="1474979266404-7eaacbcd87c5"),
        "events": [
            ("harvest", 900, 30, "Siwa grove block C"),
        ],
    },
    {
        "farm": 2,
        "crop_type": "Free-range Eggs",
        "category": "animal",
        "description": "Free-range eggs from hens pastured between citrus rows. One "
        "share = 3 dozen over the season.",
        "quantity_kg": 900,
        "price_per_share": 300,
        "share_size_kg": 6,
        "planted_days_ago": 40,
        "harvest_in_days": 4,
        "photo": UNSPLASH.format(id="1506976785307-8732e854ad03"),
        "events": [
            ("harvest", 300, 6, "Kafr El Sheikh collection room"),
            ("cold_storage", 298, 4, "Chilled store, 4°C"),
            ("transport", 292, 6, "Morning delivery route"),
            ("market", 288, 4, "Cairo hub — Maadi"),
        ],
    },
    {
        "farm": 3,
        "crop_type": "Raw Clover Honey",
        "category": "animal",
        "description": "Unfiltered, unheated clover honey extracted this month from "
        "Nile-side apiaries.",
        "quantity_kg": 600,
        "price_per_share": 350,
        "share_size_kg": 2,
        "planted_days_ago": 55,
        "harvest_in_days": 9,
        "photo": UNSPLASH.format(id="1587049352851-8d4e89133924"),
        "events": [
            ("harvest", 210, 5, "Beni Suef extraction room"),
            ("cold_storage", 208, 2, "Ambient store"),
        ],
    },
    {
        "farm": 0,
        "crop_type": "Sweet Bell Peppers",
        "category": "crop",
        "description": "Red and yellow bell peppers grown alongside the tomato "
        "blocks under shade netting.",
        "quantity_kg": 1100,
        "price_per_share": 190,
        "share_size_kg": 4,
        "planted_days_ago": 60,
        "harvest_in_days": 20,
        "photo": UNSPLASH.format(id="1525607551316-4a8e16d1f9ba"),
        "events": [],
    },
]


class Command(BaseCommand):
    help = "Seed demo farms, batches, tracking events and adoptions."

    def handle(self, *args, **options):
        self.stdout.write("Clearing existing demo data…")
        Farm.objects.all().delete()
        ConsumerSubscription.objects.all().delete()

        farmer, _ = User.objects.get_or_create(
            username="farmer",
            defaults={"email": "farmer@nabta.test", "role": User.Role.FARMER},
        )
        farmer.role = User.Role.FARMER
        farmer.set_password("nabtademo123")
        farmer.save()

        consumer, _ = User.objects.get_or_create(
            username="consumer",
            defaults={"email": "consumer@nabta.test", "role": User.Role.CONSUMER},
        )
        consumer.role = User.Role.CONSUMER
        consumer.set_password("nabtademo123")
        consumer.save()

        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser("admin", "admin@nabta.test", "nabtademo123")

        farms = []
        for data in FARMS:
            farms.append(
                Farm.objects.create(
                    name=data["name"],
                    owner=farmer,
                    location=data["location"],
                    story=data["story"],
                    photo_url=data["photo"],
                )
            )

        now = timezone.now()
        created_batches = []
        for data in BATCHES:
            batch = Batch.objects.create(
                farm=farms[data["farm"]],
                crop_type=data["crop_type"],
                category=data["category"],
                description=data["description"],
                quantity_kg=data["quantity_kg"],
                price_per_share=data["price_per_share"],
                share_size_kg=data["share_size_kg"],
                planted_date=(now - timedelta(days=data["planted_days_ago"])).date(),
                expected_harvest_date=(
                    now + timedelta(days=data["harvest_in_days"])
                ).date(),
                photo_url=data["photo"],
            )
            created_batches.append(batch)
            step = timedelta(days=3)
            for i, (stage, ok, damaged, location) in enumerate(data["events"]):
                TrackingEvent.objects.create(
                    batch=batch,
                    stage=stage,
                    quantity_ok=ok,
                    quantity_damaged=damaged,
                    location=location,
                    timestamp=now - step * (len(data["events"]) - i),
                )

        for batch in created_batches[:3]:
            ConsumerSubscription.objects.create(
                user=consumer, batch=batch, quantity_committed=1
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(farms)} farms, {len(created_batches)} batches. "
                "Logins: farmer / consumer / admin — password nabtademo123"
            )
        )

"""Seed the database with a realistic, bilingual (EN/AR) Nabta demo dataset.

Run:  python manage.py seed            (skips if batches already exist)
      python manage.py seed --force    (wipes demo data and re-seeds)
"""
import os
import secrets
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
        "name_ar": "وادي النيل العضوية",
        "location": "Fayoum, Egypt",
        "location_ar": "الفيوم، مصر",
        "story": "A family farm on the shores of Lake Qarun growing tomatoes and "
        "peppers without synthetic pesticides for three generations.",
        "story_ar": "مزرعة عائلية على ضفاف بحيرة قارون تزرع الطماطم والفلفل بدون "
        "مبيدات كيميائية منذ ثلاثة أجيال.",
        "photo": UNSPLASH.format(id="1500937386664-56d1dfef3854"),
    },
    {
        "name": "Siwa Grove Collective",
        "name_ar": "تعاونية بساتين سيوة",
        "location": "Siwa Oasis, Egypt",
        "location_ar": "واحة سيوة، مصر",
        "story": "Twelve smallholder families pressing olive oil and packing dates "
        "from the desert oasis, sharing one cold store.",
        "story_ar": "اثنتا عشرة أسرة من صغار المزارعين يعصرون زيت الزيتون ويعبّئون "
        "التمور من واحة الصحراء، ويتشاركون ثلاجة تخزين واحدة.",
        "photo": UNSPLASH.format(id="1445264718234-a623be589d37"),
    },
    {
        "name": "Nile Delta Poultry",
        "name_ar": "دواجن دلتا النيل",
        "location": "Kafr El Sheikh, Egypt",
        "location_ar": "كفر الشيخ، مصر",
        "story": "Pasture-raised hens roaming between citrus rows, producing "
        "traceable free-range eggs for Cairo households.",
        "story_ar": "دجاج يُربّى في المرعى ويتجوّل بين صفوف أشجار الموالح، وينتج "
        "بيضًا بلديًّا يمكن تتبّع مصدره لبيوت القاهرة.",
        "photo": UNSPLASH.format(id="1548550023-2bdb3c5beed7"),
    },
    {
        "name": "Beni Suef Beekeepers",
        "name_ar": "نحّالو بني سويف",
        "location": "Beni Suef, Egypt",
        "location_ar": "بني سويف، مصر",
        "story": "Migratory hives following the clover and citrus bloom along the "
        "Nile, bottling raw unfiltered honey.",
        "story_ar": "مناحل متنقّلة تتبع إزهار البرسيم والموالح على ضفاف النيل، "
        "وتعبّئ عسلًا خامًا غير مُرشَّح.",
        "photo": UNSPLASH.format(id="1587049352846-4a222e784d38"),
    },
]

BATCHES = [
    {
        "farm": 0,
        "crop_type": "Roma Tomatoes",
        "crop_type_ar": "طماطم روما",
        "category": "crop",
        "description": "Vine-ripened Roma tomatoes, hand-picked at dawn and packed "
        "the same morning.",
        "description_ar": "طماطم روما ناضجة على العرش، تُقطف يدويًّا عند الفجر "
        "وتُعبّأ في نفس الصباح.",
        "quantity_kg": 1800,
        "price_per_share": 220,
        "share_size_kg": 5,
        "planted_days_ago": 74,
        "harvest_in_days": 12,
        "photo": UNSPLASH.format(id="1592841200221-a6898f307baa"),
        "events": [
            ("harvest", 620, 40, "Fayoum packing shed", "صومعة تعبئة الفيوم"),
            ("cold_storage", 600, 20, "On-farm cold store, 8°C", "ثلاجة المزرعة، ٨°م"),
            ("transport", 580, 20, "Refrigerated van → Cairo", "شاحنة مبرّدة ← القاهرة"),
        ],
    },
    {
        "farm": 1,
        "crop_type": "Picual Olives",
        "crop_type_ar": "زيتون بيكوال",
        "category": "crop",
        "description": "First cold-press extra virgin olives from century-old Siwa "
        "trees.",
        "description_ar": "أول عصرة على البارد من أشجار زيتون سيوة المعمّرة منذ قرن.",
        "quantity_kg": 2400,
        "price_per_share": 480,
        "share_size_kg": 4,
        "planted_days_ago": 182,
        "harvest_in_days": 8,
        "photo": UNSPLASH.format(id="1474979266404-7eaacbcd87c5"),
        "events": [
            ("harvest", 900, 30, "Siwa grove block C", "بستان سيوة - قطاع ج"),
        ],
    },
    {
        "farm": 2,
        "crop_type": "Free-range Eggs",
        "crop_type_ar": "بيض بلدي",
        "category": "animal",
        "description": "Free-range eggs from hens pastured between citrus rows. One "
        "share = 3 dozen over the season.",
        "description_ar": "بيض بلدي من دجاج يرعى بين صفوف الموالح. الحصة الواحدة = "
        "٣ دستات على مدار الموسم.",
        "quantity_kg": 900,
        "price_per_share": 300,
        "share_size_kg": 6,
        "planted_days_ago": 40,
        "harvest_in_days": 4,
        "photo": UNSPLASH.format(id="1506976785307-8732e854ad03"),
        "events": [
            ("harvest", 300, 6, "Kafr El Sheikh collection room", "غرفة تجميع كفر الشيخ"),
            ("cold_storage", 298, 4, "Chilled store, 4°C", "مخزن مبرّد، ٤°م"),
            ("transport", 292, 6, "Morning delivery route", "خط التوزيع الصباحي"),
            ("market", 288, 4, "Cairo hub — Maadi", "مركز القاهرة - المعادي"),
        ],
    },
    {
        "farm": 3,
        "crop_type": "Raw Clover Honey",
        "crop_type_ar": "عسل برسيم خام",
        "category": "animal",
        "description": "Unfiltered, unheated clover honey extracted this month from "
        "Nile-side apiaries.",
        "description_ar": "عسل برسيم غير مُرشَّح وغير مُسخَّن، استُخرج هذا الشهر من "
        "مناحل على ضفاف النيل.",
        "quantity_kg": 600,
        "price_per_share": 350,
        "share_size_kg": 2,
        "planted_days_ago": 55,
        "harvest_in_days": 9,
        "photo": UNSPLASH.format(id="1587049352851-8d4e89133924"),
        "events": [
            ("harvest", 210, 5, "Beni Suef extraction room", "غرفة الفرز ببني سويف"),
            ("cold_storage", 208, 2, "Ambient store", "مخزن بدرجة حرارة الغرفة"),
        ],
    },
    {
        "farm": 0,
        "crop_type": "Sweet Bell Peppers",
        "crop_type_ar": "فلفل رومي حلو",
        "category": "crop",
        "description": "Red and yellow bell peppers grown alongside the tomato "
        "blocks under shade netting.",
        "description_ar": "فلفل رومي أحمر وأصفر يُزرع بجانب أحواض الطماطم تحت شباك "
        "التظليل.",
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
    help = "Seed demo farms, batches, tracking events and adoptions (bilingual)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Re-seed even if batches already exist (wipes demo data first).",
        )

    def handle(self, *args, **options):
        if Batch.objects.exists() and not options["force"]:
            self.stdout.write(
                "Batches already exist — skipping seed. Use --force to re-seed."
            )
            return

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

        # Create an admin superuser only if none exists. Its password comes from
        # DJANGO_ADMIN_PASSWORD; without that env var a random one is used and
        # never printed — set the password yourself (env var or the shell) to
        # actually log in. The public farmer/consumer accounts are enough for
        # the demo.
        if not User.objects.filter(is_superuser=True).exists():
            admin_pw = os.environ.get("DJANGO_ADMIN_PASSWORD") or secrets.token_urlsafe(24)
            User.objects.create_superuser("admin", "admin@nabta.test", admin_pw)

        farms = []
        for data in FARMS:
            farms.append(
                Farm.objects.create(
                    name=data["name"],
                    name_ar=data["name_ar"],
                    owner=farmer,
                    location=data["location"],
                    location_ar=data["location_ar"],
                    story=data["story"],
                    story_ar=data["story_ar"],
                    photo_url=data["photo"],
                )
            )

        now = timezone.now()
        created_batches = []
        for data in BATCHES:
            batch = Batch.objects.create(
                farm=farms[data["farm"]],
                crop_type=data["crop_type"],
                crop_type_ar=data["crop_type_ar"],
                category=data["category"],
                description=data["description"],
                description_ar=data["description_ar"],
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
            events = data["events"]
            for i, (stage, ok, damaged, loc, loc_ar) in enumerate(events):
                TrackingEvent.objects.create(
                    batch=batch,
                    stage=stage,
                    quantity_ok=ok,
                    quantity_damaged=damaged,
                    location=loc,
                    location_ar=loc_ar,
                    timestamp=now - step * (len(events) - i),
                )

        for batch in created_batches[:3]:
            ConsumerSubscription.objects.create(
                user=consumer, batch=batch, quantity_committed=1
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(farms)} farms, {len(created_batches)} batches (EN/AR). "
                "Demo logins: farmer / consumer — password nabtademo123"
            )
        )

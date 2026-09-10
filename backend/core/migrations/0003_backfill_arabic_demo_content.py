"""Backfill Arabic translations onto the seeded demo rows.

The `seed` command is skip-if-exists, so a database seeded before the bilingual
fields were added keeps empty `*_ar` columns. This migration fills them in by
matching the known English seed values. It only touches rows that match the seed
and still have a blank translation, so user-created data is left alone.
"""
from django.db import migrations

FARMS = {
    "Wadi El Nil Organic": {
        "name_ar": "وادي النيل العضوية",
        "location_ar": "الفيوم، مصر",
        "story_ar": "مزرعة عائلية على ضفاف بحيرة قارون تزرع الطماطم والفلفل بدون "
        "مبيدات كيميائية منذ ثلاثة أجيال.",
    },
    "Siwa Grove Collective": {
        "name_ar": "تعاونية بساتين سيوة",
        "location_ar": "واحة سيوة، مصر",
        "story_ar": "اثنتا عشرة أسرة من صغار المزارعين يعصرون زيت الزيتون ويعبّئون "
        "التمور من واحة الصحراء، ويتشاركون ثلاجة تخزين واحدة.",
    },
    "Nile Delta Poultry": {
        "name_ar": "دواجن دلتا النيل",
        "location_ar": "كفر الشيخ، مصر",
        "story_ar": "دجاج يُربّى في المرعى ويتجوّل بين صفوف أشجار الموالح، وينتج "
        "بيضًا بلديًّا يمكن تتبّع مصدره لبيوت القاهرة.",
    },
    "Beni Suef Beekeepers": {
        "name_ar": "نحّالو بني سويف",
        "location_ar": "بني سويف، مصر",
        "story_ar": "مناحل متنقّلة تتبع إزهار البرسيم والموالح على ضفاف النيل، "
        "وتعبّئ عسلًا خامًا غير مُرشَّح.",
    },
}

BATCHES = {
    "Roma Tomatoes": {
        "crop_type_ar": "طماطم روما",
        "description_ar": "طماطم روما ناضجة على العرش، تُقطف يدويًّا عند الفجر "
        "وتُعبّأ في نفس الصباح.",
    },
    "Picual Olives": {
        "crop_type_ar": "زيتون بيكوال",
        "description_ar": "أول عصرة على البارد من أشجار زيتون سيوة المعمّرة منذ قرن.",
    },
    "Free-range Eggs": {
        "crop_type_ar": "بيض بلدي",
        "description_ar": "بيض بلدي من دجاج يرعى بين صفوف الموالح. الحصة الواحدة = "
        "٣ دستات على مدار الموسم.",
    },
    "Raw Clover Honey": {
        "crop_type_ar": "عسل برسيم خام",
        "description_ar": "عسل برسيم غير مُرشَّح وغير مُسخَّن، استُخرج هذا الشهر من "
        "مناحل على ضفاف النيل.",
    },
    "Sweet Bell Peppers": {
        "crop_type_ar": "فلفل رومي حلو",
        "description_ar": "فلفل رومي أحمر وأصفر يُزرع بجانب أحواض الطماطم تحت شباك "
        "التظليل.",
    },
}

EVENT_LOCATIONS = {
    "Fayoum packing shed": "صومعة تعبئة الفيوم",
    "On-farm cold store, 8°C": "ثلاجة المزرعة، ٨°م",
    "Refrigerated van → Cairo": "شاحنة مبرّدة ← القاهرة",
    "Siwa grove block C": "بستان سيوة - قطاع ج",
    "Kafr El Sheikh collection room": "غرفة تجميع كفر الشيخ",
    "Chilled store, 4°C": "مخزن مبرّد، ٤°م",
    "Morning delivery route": "خط التوزيع الصباحي",
    "Cairo hub — Maadi": "مركز القاهرة - المعادي",
    "Beni Suef extraction room": "غرفة الفرز ببني سويف",
    "Ambient store": "مخزن بدرجة حرارة الغرفة",
}


def forwards(apps, schema_editor):
    Farm = apps.get_model("core", "Farm")
    Batch = apps.get_model("core", "Batch")
    TrackingEvent = apps.get_model("core", "TrackingEvent")

    for name, tr in FARMS.items():
        Farm.objects.filter(name=name, name_ar="").update(**tr)

    for crop, tr in BATCHES.items():
        Batch.objects.filter(crop_type=crop, crop_type_ar="").update(**tr)

    for loc, loc_ar in EVENT_LOCATIONS.items():
        TrackingEvent.objects.filter(location=loc, location_ar="").update(
            location_ar=loc_ar
        )


def backwards(apps, schema_editor):
    # Non-destructive to reverse: clearing the backfilled columns is safe.
    Farm = apps.get_model("core", "Farm")
    Batch = apps.get_model("core", "Batch")
    TrackingEvent = apps.get_model("core", "TrackingEvent")

    for name in FARMS:
        Farm.objects.filter(name=name).update(name_ar="", location_ar="", story_ar="")
    for crop in BATCHES:
        Batch.objects.filter(crop_type=crop).update(crop_type_ar="", description_ar="")
    for loc in EVENT_LOCATIONS:
        TrackingEvent.objects.filter(location=loc).update(location_ar="")


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0002_batch_crop_type_ar_batch_description_ar_and_more"),
    ]

    operations = [migrations.RunPython(forwards, backwards)]

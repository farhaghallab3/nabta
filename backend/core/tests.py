from datetime import date, timedelta

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from core.models import Batch, Farm

User = get_user_model()


class NabtaAPITests(APITestCase):
    def setUp(self):
        self.farmer = User.objects.create_user(
            "farmer1", password="pass12345", role=User.Role.FARMER
        )
        self.consumer = User.objects.create_user(
            "consumer1", password="pass12345", role=User.Role.CONSUMER
        )
        self.farm = Farm.objects.create(
            name="Test Farm", owner=self.farmer, location="Fayoum"
        )
        self.farm.name_ar = "مزرعة تجريبية"
        self.farm.save()
        self.batch = Batch.objects.create(
            farm=self.farm,
            crop_type="Tomatoes",
            crop_type_ar="طماطم",
            quantity_kg=100,
            planted_date=date.today() - timedelta(days=30),
            expected_harvest_date=date.today() + timedelta(days=30),
        )

    def auth(self, username):
        res = self.client.post(
            "/api/auth/login/",
            {"username": username, "password": "pass12345"},
            format="json",
        )
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + res.data["access"])

    def test_batches_list_is_public(self):
        self.assertEqual(self.client.get("/api/batches/").status_code, 200)

    def test_localized_fields_switch_with_lang(self):
        en = self.client.get("/api/batches/").data["results"][0]
        self.assertEqual(en["crop_type"], "Tomatoes")
        self.assertEqual(en["farm_name"], "Test Farm")

        ar = self.client.get("/api/batches/?lang=ar").data["results"][0]
        self.assertEqual(ar["crop_type"], "طماطم")
        self.assertEqual(ar["farm_name"], "مزرعة تجريبية")

    def test_lang_falls_back_when_translation_missing(self):
        # description_ar is empty -> Arabic request still returns the English text
        ar = self.client.get(f"/api/batches/{self.batch.id}/?lang=ar").data
        self.assertEqual(ar["category"], "crop")
        self.assertEqual(ar["description"], "")

    def test_consumer_cannot_create_batch(self):
        self.auth("consumer1")
        res = self.client.post(
            "/api/batches/",
            {
                "crop_type": "Peppers",
                "farm_name": "X",
                "quantity_kg": 10,
                "planted_date": "2026-01-01",
                "expected_harvest_date": "2026-06-01",
            },
            format="json",
        )
        self.assertEqual(res.status_code, 403)

    def test_consumer_adopts_once(self):
        self.auth("consumer1")
        first = self.client.post(f"/api/batches/{self.batch.id}/adopt/", {}, format="json")
        self.assertEqual(first.status_code, 201)
        second = self.client.post(
            f"/api/batches/{self.batch.id}/adopt/", {}, format="json"
        )
        self.assertEqual(second.status_code, 400)

    def test_farmer_logs_event_and_analytics(self):
        self.auth("farmer1")
        res = self.client.post(
            f"/api/batches/{self.batch.id}/track-event/",
            {"stage": "harvest", "quantity_ok": 90, "quantity_damaged": 10},
            format="json",
        )
        self.assertEqual(res.status_code, 201)
        analytics = self.client.get("/api/farmer/analytics/")
        self.assertEqual(analytics.status_code, 200)
        self.assertEqual(analytics.data["overall_loss_pct"], 10.0)

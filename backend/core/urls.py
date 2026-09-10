from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    BatchViewSet,
    FarmViewSet,
    FarmerAnalyticsView,
    MyAdoptionsView,
)

router = DefaultRouter()
router.register("batches", BatchViewSet, basename="batch")
router.register("farms", FarmViewSet, basename="farm")

urlpatterns = [
    path("my-adoptions/", MyAdoptionsView.as_view(), name="my-adoptions"),
    path("farmer/analytics/", FarmerAnalyticsView.as_view(), name="farmer-analytics"),
    path("", include(router.urls)),
]

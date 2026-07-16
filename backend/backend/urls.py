from django.urls import path, include
from rest_framework.routers import DefaultRouter

from snippets.views import (
    HomeAPIView,
    MenuViewSet,
    ReservationViewSet,
)

router = DefaultRouter()

router.register(r"menu", MenuViewSet, basename="menu")
router.register(r"reservation", ReservationViewSet, basename="reservation")

urlpatterns = [
    path("home/", HomeAPIView.as_view(), name="home"),

    path("", include(router.urls)),
]
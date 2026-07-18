from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from snippets.views import (
    HomeAPIView,
    MenuViewSet,
    ReservationViewSet,
    CategoryViewSet,
)

router = DefaultRouter()
router.register(r"menu", MenuViewSet, basename="menu")
router.register(r"reservation", ReservationViewSet, basename="reservation")
router.register(r"category", CategoryViewSet, basename="category")

urlpatterns = [
    path("home/", HomeAPIView.as_view(), name="home"),
    path("", include(router.urls)),
    path("api/login/", TokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),
]
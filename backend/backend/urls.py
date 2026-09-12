from django.conf import settings
from django.conf.urls.static import static
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

# Serve uploaded menu item photos from MEDIA_ROOT during development.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path, re_path
from django.views.static import serve
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

# Serve uploaded menu item photos from MEDIA_ROOT.
#
# With CLOUDINARY_URL set, MenuItem.image.url already points at Cloudinary's CDN
# and nothing below is used. Without it the API hands out /media/... paths, and
# those have to resolve to something: django.conf.urls.static.static() only
# returns routes while DEBUG is True, so on the deployed site every photo 404s.
# This serves them either way. Cloudinary is still the better option, because
# Render's disk does not keep newly uploaded files between deploys.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
elif settings.STORAGES["default"]["BACKEND"] == (
    "django.core.files.storage.FileSystemStorage"
):
    urlpatterns += [
        re_path(
            r"^%s(?P<path>.*)$" % settings.MEDIA_URL.lstrip("/"),
            serve,
            {"document_root": settings.MEDIA_ROOT},
        )
    ]
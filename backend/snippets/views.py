from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import Hero, Story, MenuItem, Reservation
from .Serializer import (
    HeroSerializer,
    StorySerializer,
    MenuItemSerializer,
    ReservationSerializer,
    Category,
)
from .Serializer import CategorySerializer

class HomeAPIView(APIView):
    def get(self, request):
        hero = Hero.objects.first()
        story = Story.objects.first()
        menu = MenuItem.objects.all()

        return Response({
            "hero": HeroSerializer(hero).data,
            "story": StorySerializer(story).data,
            "MenuItem": MenuItemSerializer(menu, many=True).data,
        })


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class MenuViewSet(ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]

        return [permission() for permission in permission_classes]
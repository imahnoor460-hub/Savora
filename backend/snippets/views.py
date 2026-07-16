from rest_framework.views import APIView
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Hero, Story, MenuItem, Category,Reservation
from .Serializer import ReservationSerializer
from .models import MenuItem
from .Serializer import MenuItemSerializer


from .Serializer import (
    HeroSerializer,
    StorySerializer,
    MenuItemSerializer,
)
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

class MenuViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
      
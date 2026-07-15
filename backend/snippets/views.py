
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Hero, Story, MenuItem, Category,Reservation
from .Serializer import ReservationSerializer

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
class ReservationAPIView(APIView):

    def post(self, request):

        serializer = ReservationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   
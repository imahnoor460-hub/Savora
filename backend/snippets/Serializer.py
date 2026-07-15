from rest_framework import serializers
from .models import Hero, Story, MenuItem,Category, Reservation

class HeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hero
        fields = '__all__'

class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'

class ReservationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reservation
        fields = "__all__"
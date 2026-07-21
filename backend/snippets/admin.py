from django.contrib import admin
from .models import Hero, Story, Category, MenuItem, Reservation

admin.site.register(Hero)
admin.site.register(Story)
admin.site.register(Category)
admin.site.register(MenuItem)
admin.site.register(Reservation)
from django.db import models

class Hero(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.CharField(max_length=255)

    def __str__(self):
     return self.name
    
class Story(models.Model):
    heading = models.CharField(max_length=200)
    description = models.TextField()
    image = models.CharField(max_length=255)

    def __str__(self):
        return self.heading
    
class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.name

class Reservation(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    guests = models.IntegerField()
    date = models.DateField()
    time = models.TimeField()
    special_request = models.TextField(blank=True)

    def __str__(self):
        return self.name
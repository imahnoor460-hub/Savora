from django.core.validators import FileExtensionValidator
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

    class Meta:
        # Categories are served to the frontend in creation order, so the menu
        # tabs always appear in the order they were set up in the admin.
        ordering = ["id"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    # PROTECT, not CASCADE: deleting a category must never silently delete the
    # dishes in it. Reassign the dishes first, then delete the empty category.
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)

    # Tasting detail shown on the public dish modal. All optional, so dishes
    # that were created before these existed keep working with empty values;
    # the frontend hides any section that has no content.
    composition = models.TextField(
        blank=True,
        default="",
        help_text="Comma separated, e.g. Native lobster, La Mancha saffron, Fennel pollen",
    )
    energy = models.CharField(
        max_length=50, blank=True, default="", help_text="e.g. 640 kcal"
    )
    allergens = models.CharField(
        max_length=200, blank=True, default="", help_text="e.g. Crustaceans, Dairy"
    )
    pairing = models.CharField(
        max_length=200, blank=True, default="", help_text="e.g. Barolo 2009"
    )
    is_chef_recommendation = models.BooleanField(
        default=False,
        verbose_name="Chef's Recommendation",
        help_text="Show the Chef's Recommendation badge for this dish.",
    )

    # Uploaded into MEDIA_ROOT/menu_items/. Optional, so dishes without a photo
    # keep using the frontend's existing fallback image.
    image = models.ImageField(
        upload_to="menu_items/",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])],
        help_text="JPG, JPEG, PNG or WEBP.",
    )

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # When the photo is replaced or cleared, drop the file it used to point
        # at so old uploads do not pile up in MEDIA_ROOT.
        old_image = None
        if self.pk:
            old_image = (
                MenuItem.objects.filter(pk=self.pk)
                .values_list("image", flat=True)
                .first()
            )

        super().save(*args, **kwargs)

        if old_image and old_image != self.image.name:
            self._delete_file(old_image)

    def delete(self, *args, **kwargs):
        image_name = self.image.name
        super().delete(*args, **kwargs)
        if image_name:
            self._delete_file(image_name)

    @staticmethod
    def _delete_file(name):
        try:
            if MenuItem.image.field.storage.exists(name):
                MenuItem.image.field.storage.delete(name)
        except (OSError, NotImplementedError):
            # Never let a stale file break saving the record itself.
            pass

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
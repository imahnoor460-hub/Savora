from django.contrib import admin
from .models import Hero, Story, Category, MenuItem, Reservation


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "dish_count")
    search_fields = ("name",)

    @admin.display(description="Dishes")
    def dish_count(self, obj):
        return obj.menuitem_set.count()


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    # `category` and the Chef's Recommendation flag are editable straight from
    # the list, so dishes can be moved or promoted without opening each one.
    list_display = ("name", "category", "price", "is_chef_recommendation")
    list_editable = ("category", "is_chef_recommendation")
    list_filter = ("category", "is_chef_recommendation")
    search_fields = ("name", "description")
    ordering = ("category", "name")

    fieldsets = (
        (None, {"fields": ("category", "name", "description", "price", "image")}),
        (
            "Tasting detail",
            {
                "fields": ("composition", "energy", "allergens", "pairing"),
                "description": "Optional. Anything left blank is hidden on the public menu.",
            },
        ),
        ("Promotion", {"fields": ("is_chef_recommendation",)}),
    )


admin.site.register(Hero)
admin.site.register(Story)
admin.site.register(Reservation)

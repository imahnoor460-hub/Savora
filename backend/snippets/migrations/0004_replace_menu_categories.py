"""Replace the old menu categories with the six current ones.

Menu items are NEVER deleted here. Every item is reassigned to one of the new
categories first, and only then are the old (now empty) categories removed.
"""

from django.db import migrations

# The six categories, in the order they should appear on the site.
NEW_CATEGORIES = [
    "Starters & Appetizers",
    "Chef's Signature Mains",
    "Steaks & Wagyu",
    "Artisanal Pasta",
    "Desserts",
    "Luxury Cocktails / Beverages",
]

# Anything whose old category is not listed below lands here, so no dish can
# ever be orphaned by this migration.
FALLBACK_CATEGORY = "Chef's Signature Mains"

# old category name -> new category name
CATEGORY_MAP = {
    "Appetizers": "Starters & Appetizers",
    "Seafood": "Chef's Signature Mains",
    "Special Combos": "Chef's Signature Mains",
    "Kids Meal": "Chef's Signature Mains",
    "Desserts": "Desserts",
    "Beverages": "Luxury Cocktails / Beverages",
}

# "Main Course" splits across several new categories, so route those by dish.
ITEM_MAP = {
    "Grilled Steak": "Steaks & Wagyu",
    "Creamy Pasta": "Artisanal Pasta",
    "Chicken Alfredo": "Artisanal Pasta",
}


def replace_categories(apps, schema_editor):
    Category = apps.get_model("snippets", "Category")
    MenuItem = apps.get_model("snippets", "MenuItem")

    old_category_ids = list(Category.objects.values_list("id", flat=True))

    # Create the new categories in order; reuse one if it is already there so
    # the migration stays safe to re-run against a partially migrated database.
    new_categories = {}
    for name in NEW_CATEGORIES:
        category = Category.objects.filter(name=name).exclude(
            id__in=old_category_ids
        ).first()
        if category is None:
            category = Category.objects.create(name=name)
        new_categories[name] = category

    # Move every dish onto its new category before anything gets deleted.
    for item in MenuItem.objects.select_related("category"):
        old_name = item.category.name if item.category_id else ""
        target = ITEM_MAP.get(item.name) or CATEGORY_MAP.get(old_name, FALLBACK_CATEGORY)
        item.category = new_categories[target]
        item.save(update_fields=["category"])

    # Only now, with nothing pointing at them, drop the old categories.
    Category.objects.filter(id__in=old_category_ids).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("snippets", "0003_alter_category_options_alter_menuitem_category"),
    ]

    operations = [
        migrations.RunPython(replace_categories, migrations.RunPython.noop),
    ]

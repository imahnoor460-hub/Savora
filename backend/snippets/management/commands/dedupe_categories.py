"""
Merge categories that share a name.

Migration 0004 creates the six categories on an empty database, and the fixture
then loads its own copies under the primary keys they happened to get on the
machine the dump came from. On a fresh deploy those two sets do not collide, so
the table ends up with each category twice: one set carrying every menu item and
one set carrying none.

This merges them by name, keeping whichever row the menu items actually point
at. It is idempotent: with no duplicates present it does nothing.
"""

from collections import defaultdict

from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Count

from snippets.models import Category, MenuItem


class Command(BaseCommand):
    help = "Merge duplicate categories by name, keeping the one in use."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Report what would change without writing anything.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        by_name = defaultdict(list)
        for category in Category.objects.annotate(item_count=Count("menuitem")):
            by_name[category.name].append(category)

        merged = removed = 0

        for name, categories in sorted(by_name.items()):
            if len(categories) < 2:
                continue

            # Keep the row the menu items already reference; fall back to the
            # lowest id so the choice is stable when neither is in use.
            keeper = max(categories, key=lambda c: (c.item_count, -c.id))
            losers = [c for c in categories if c.id != keeper.id]

            moved = MenuItem.objects.filter(category__in=losers).count()
            loser_ids = [c.id for c in losers]

            self.stdout.write(
                f"{name!r}: keeping id={keeper.id} "
                f"({keeper.item_count} items), removing {loser_ids}"
                + (f", moving {moved} item(s)" if moved else "")
            )

            if not options["dry_run"]:
                if moved:
                    MenuItem.objects.filter(category__in=losers).update(
                        category=keeper
                    )
                Category.objects.filter(id__in=loser_ids).delete()

            merged += moved
            removed += len(losers)

        if options["dry_run"]:
            transaction.set_rollback(True)

        if removed:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Removed {removed} duplicate categor"
                    f"{'y' if removed == 1 else 'ies'}, moved {merged} menu item(s)."
                )
            )
        else:
            self.stdout.write("No duplicate categories found.")

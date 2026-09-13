"""
Check that every menu photo actually resolves.

MenuItem.image stores a path relative to MEDIA_ROOT ("menu_items/foo.jpg").
Whichever storage backend is active turns that into a URL, so this reports what
the API is really handing the frontend and whether it loads — which is the only
way to tell a correct upload from one that landed under the wrong public_id.
"""

import urllib.error
import urllib.request

from django.core.management.base import BaseCommand

from snippets.models import MenuItem

TIMEOUT_SECONDS = 30


class Command(BaseCommand):
    help = "Report the HTTP status of every MenuItem image URL."

    def add_arguments(self, parser):
        parser.add_argument(
            "--quiet",
            action="store_true",
            help="Only list the broken ones.",
        )

    def handle(self, *args, **options):
        items = MenuItem.objects.exclude(image="").exclude(image__isnull=True)
        total = items.count()

        if not total:
            self.stdout.write("No menu items have an image.")
            return

        ok, broken = 0, []

        for item in items.order_by("id"):
            try:
                url = item.image.url
            except Exception as exc:  # noqa: BLE001 - storage may refuse a name
                broken.append((item, "-", f"no URL: {exc}"))
                continue

            request = urllib.request.Request(url, method="GET")
            try:
                with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as r:
                    status = r.status
            except urllib.error.HTTPError as exc:
                status = exc.code
            except Exception as exc:  # noqa: BLE001 - DNS, TLS, timeouts
                broken.append((item, "-", str(exc)))
                continue

            if status == 200:
                ok += 1
                if not options["quiet"]:
                    self.stdout.write(f"  200  {item.image.name}")
            else:
                broken.append((item, status, url))

        self.stdout.write("")
        for item, status, url in broken:
            self.stderr.write(
                self.style.ERROR(f"  {status}  #{item.id} {item.name} -> {url}")
            )

        summary = f"{ok}/{total} images OK"
        if broken:
            self.stdout.write(self.style.ERROR(f"{summary}, {len(broken)} broken."))
        else:
            self.stdout.write(self.style.SUCCESS(f"{summary}."))

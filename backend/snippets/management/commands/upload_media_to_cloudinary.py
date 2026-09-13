"""
Push the local media/ tree to Cloudinary.

The menu fixture stores relative paths such as "menu_items/foie_gras.jpg". Those
resolve through whichever storage backend is active, so the files only need to
exist on Cloudinary under the same names for the deployed site to find them.
Run this once, locally, after CLOUDINARY_URL is set:

    python manage.py upload_media_to_cloudinary
"""

import os

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Upload every file under MEDIA_ROOT to Cloudinary, preserving paths."

    def add_arguments(self, parser):
        parser.add_argument(
            "--overwrite",
            action="store_true",
            help="Replace files that already exist on Cloudinary.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="List what would be uploaded without contacting Cloudinary.",
        )

    def handle(self, *args, **options):
        if not os.environ.get("CLOUDINARY_URL", "").strip():
            raise CommandError(
                "CLOUDINARY_URL is not set. Copy it from your Cloudinary "
                "dashboard (Account Details -> API environment variable)."
            )

        media_root = settings.MEDIA_ROOT
        if not os.path.isdir(media_root):
            raise CommandError(f"MEDIA_ROOT does not exist: {media_root}")

        import cloudinary.uploader

        uploaded = skipped = failed = 0

        for dirpath, _dirnames, filenames in os.walk(media_root):
            for filename in sorted(filenames):
                full_path = os.path.join(dirpath, filename)
                relative = os.path.relpath(full_path, media_root).replace(os.sep, "/")

                # Cloudinary appends its own format extension, so the public_id
                # must not carry one or the stored path stops matching.
                public_id = os.path.splitext(relative)[0]

                if options["dry_run"]:
                    self.stdout.write(f"would upload {relative} -> {public_id}")
                    uploaded += 1
                    continue

                try:
                    cloudinary.uploader.upload(
                        full_path,
                        public_id=public_id,
                        resource_type="image",
                        overwrite=options["overwrite"],
                        invalidate=True,
                    )
                except Exception as exc:  # noqa: BLE001 - report and keep going
                    failed += 1
                    self.stderr.write(self.style.ERROR(f"FAILED {relative}: {exc}"))
                    continue

                uploaded += 1
                self.stdout.write(f"uploaded {relative}")

        summary = f"{uploaded} uploaded, {skipped} skipped, {failed} failed."
        style = self.style.ERROR if failed else self.style.SUCCESS
        self.stdout.write(style(summary))

"""
Create the admin account on a fresh database.

Render's Postgres starts empty, and `createsuperuser` is interactive (its
--noinput form fails outright if the account already exists), so neither works
in a build command. This command is idempotent: it creates the account when it
is missing, updates the password when it is not, and does nothing at all when
the environment variables are absent.
"""

import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or update the superuser described by DJANGO_SUPERUSER_* env vars."

    def handle(self, *args, **options):
        username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "").strip()
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "").strip()

        if not username or not password:
            self.stdout.write(
                "DJANGO_SUPERUSER_USERNAME / DJANGO_SUPERUSER_PASSWORD not set; "
                "skipping superuser creation."
            )
            return

        User = get_user_model()
        user, created = User.objects.get_or_create(
            **{User.USERNAME_FIELD: username},
            defaults={"email": email, "is_staff": True, "is_superuser": True},
        )

        # An existing account may predate this command, or its password may have
        # been rotated in the environment; keep both in sync either way.
        user.is_staff = True
        user.is_superuser = True
        if email:
            user.email = email
        user.set_password(password)
        user.save()

        verb = "Created" if created else "Updated"
        self.stdout.write(self.style.SUCCESS(f"{verb} superuser {username!r}."))

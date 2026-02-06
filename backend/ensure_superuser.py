import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "social_media.settings")
django.setup()

from django.contrib.auth.models import User

username = 'admin'
password = 'adminpassword123'
email = 'admin@example.com'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"User {username} created.")
else:
    print(f"User {username} already exists.")

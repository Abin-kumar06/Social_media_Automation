from django.core.management.base import BaseCommand
from apps.posts.models import Post
from apps.posts.tasks import generate_post_text_task, publish_instagram_post
from apps.platforms.models import SocialAccount
from django.contrib.auth.models import User
import time

class Command(BaseCommand):
    help = 'Test full flow: Content Generation -> Instagram Publishing'

    def handle(self, *args, **options):
        # 1. Get the first user
        user = User.objects.first()
        if not user:
            self.stdout.write(self.style.ERROR("No user found. Run python manage.py createsuperuser first."))
            return

        # 2. Check if Instagram is connected
        social_account = SocialAccount.objects.filter(user=user, platform='instagram').first()
        if not social_account:
            self.stdout.write(self.style.WARNING("Instagram is not connected. The final publishing step will fail."))
            self.stdout.write("Please connect via: http://localhost:8000/api/platforms/instagram/connect/")

        # 3. Create a post
        post = Post.objects.create(
            user=user,
            content="This is a full-flow automated test of the Social Media Automation Platform! #AI #Automation",
            goal="announcement",
            platforms=["instagram"],
            # We need a dummy image field to pass validation in the task
            image="post_images/test.jpg" 
        )
        self.stdout.write(self.style.SUCCESS(f"Step 1: Created Post ID: {post.id}"))

        # 4. Generate Text
        self.stdout.write("Step 2: Triggering Ollama AI generation...")
        generate_post_text_task(post.id) # Call synchronously for test
        
        post.refresh_from_db()
        if post.status == 'generated':
            self.stdout.write(self.style.SUCCESS(f"Success: AI generated Instagram Caption: {post.instagram_caption[:100]}..."))
        else:
            self.stdout.write(self.style.ERROR(f"Fail: AI generation failed. Status: {post.status}"))
            return

        # 5. Publish to Instagram
        if social_account:
            self.stdout.write("Step 3: Triggering Instagram publishing...")
            publish_instagram_post(post.id) # Call synchronously
            
            post.refresh_from_db()
            if post.status == 'posted':
                self.stdout.write(self.style.SUCCESS("🎉 Success! The post has been published to Instagram."))
            else:
                self.stdout.write(self.style.ERROR(f"Fail: Instagram publishing failed. Status: {post.status}"))
                self.stdout.write("Check Celery logs or SocialAccount tokens.")
        else:
            self.stdout.write(self.style.WARNING("Step 3: Skipping publishing because Instagram is not connected."))

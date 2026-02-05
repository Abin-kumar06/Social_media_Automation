from django.core.management.base import BaseCommand
from apps.posts.models import Post
from apps.posts.tasks import generate_post_text_task
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Test Ollama integration by triggering a post generation task'

    def handle(self, *args, **options):
        # 1. Get or create a test user
        user, _ = User.objects.get_or_create(username='testviewer')
        
        # 2. Create a post
        post = Post.objects.create(
            user=user,
            content="Our new local AI integration is now live! Use Ollama to generate platform-specific content automatically.",
            goal="announcement",
            platforms=["instagram", "linkedin", "twitter"]
        )
        self.stdout.write(self.style.SUCCESS(f"Created Post ID: {post.id}"))
        
        # 3. Trigger task synchronously for testing
        self.stdout.write("Triggering generation task...")
        try:
            # We call the function directly instead of .delay() to see output immediately
            # Note: In a real app, this runs in Celery.
            generate_post_text_task(post.id)
            
            # Refresh from DB
            post.refresh_from_db()
            self.stdout.write(self.style.SUCCESS(f"Status: {post.status}"))
            
            if post.status == 'generated':
                self.stdout.write(self.style.SUCCESS(f"\n--- BASE CAPTION ---\n{post.base_caption}\n"))
                self.stdout.write(self.style.SUCCESS(f"--- INSTAGRAM CAPTION ---\n{post.instagram_caption}\n"))
                self.stdout.write(self.style.SUCCESS(f"--- INSTAGRAM HASHTAGS ---\n{post.instagram_hashtags}\n"))
            else:
                self.stdout.write(self.style.ERROR("Generation failed or still in progress."))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))

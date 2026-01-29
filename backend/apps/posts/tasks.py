from celery import shared_task
from .models import Post
from apps.ai_engine.services import PostGenerationService

@shared_task(bind=True, max_retries=3)
def generate_post_text_task(self, post_id):
    try:
        post = Post.objects.get(id=post_id)
        service = PostGenerationService()
        
        # Call service to generate content
        results = service.generate_all_platforms(post)
        
        post.generated_outputs = results
        post.status = 'generated'
        post.save()
        
    except Post.DoesNotExist:
        # If post doesn't exist, we don't retry
        return
    except Exception as exc:
        # Retry logic
        post.status = 'failed'
        post.save()
        raise self.retry(exc=exc, countdown=60)  # simple retry strategy

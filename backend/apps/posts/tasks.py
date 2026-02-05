import logging
from celery import shared_task
from .models import Post
from apps.ai_engine.services import PostGenerationService
from django.conf import settings

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def generate_post_text_task(self, post_id):
    try:
        post = Post.objects.get(id=post_id)
        post.status = 'generating'
        post.save()
        
        service = PostGenerationService()
        # The service now saves the content and sets status to 'generated'
        service.generate_all_platform_text(post)
        
        return f"Post {post_id} text generated successfully"
        
    except Post.DoesNotExist:
        logger.error(f"Post {post_id} not found")
        return
    except Exception as exc:
        logger.error(f"Error generating text for post {post_id}: {str(exc)}")
        if self.request.retries >= self.max_retries:
            post.status = 'failed'
            post.save()
        raise self.retry(exc=exc, countdown=60)
@shared_task(bind=True, max_retries=3)
def publish_instagram_post(self, post_id):
    from apps.platforms.models import SocialAccount
    from apps.platforms.services.instagram import InstagramService
    
    try:
        post = Post.objects.get(id=post_id)
        social_account = SocialAccount.objects.filter(user=post.user, platform='instagram').first()
        
        if not social_account:
            post.status = 'failed'
            post.save()
            logger.error(f"No Instagram account connected for user {post.user.username}")
            return
            
        post.status = 'posting'
        post.save()
        
        # 1. Get Instagram specific content
        caption = post.instagram_caption or post.content
        if post.instagram_hashtags:
            caption += f"\n\n{post.instagram_hashtags}"
        
        # For Instagram, we need an image URL. 
        # In a real app, this would be a public URL. 
        # For testing, we'll use a placeholder or the actual image URL if available.
        if not post.image:
            raise Exception("No image found for the post. Instagram requires an image.")
            
        image_url = settings.SITE_URL + post.image.url
        
        # 2. Create media container
        creation_id = InstagramService.create_media_container(
            social_account.external_user_id,
            social_account.access_token,
            image_url,
            caption
        )
        
        # 3. Publish container
        publish_id = InstagramService.publish_media(
            social_account.external_user_id,
            social_account.access_token,
            creation_id
        )
        
        post.status = 'posted'
        # Store Meta response ID
        post.generated_outputs['instagram']['publish_id'] = publish_id
        post.save()
        
    except Post.DoesNotExist:
        return
    except Exception as exc:
        post.status = 'failed'
        post.save()
        logger.error(f"Failed to publish to Instagram: {str(exc)}")
        raise self.retry(exc=exc, countdown=300)

@shared_task
def check_and_publish_scheduled_posts():
    from django.utils import timezone
    from .models import Post
    
    now = timezone.now()
    # Get posts that are due and have 'generated' status (ready to be posted)
    scheduled_posts = Post.objects.filter(
        scheduled_at__lte=now,
        status='generated'
    )
    
    logger.info(f"Checking for scheduled posts at {now}. Found {scheduled_posts.count()} due posts.")
    
    for post in scheduled_posts:
        # Trigger individual platform publishing tasks
        # For now we only have Instagram
        if 'instagram' in post.platforms:
            publish_instagram_post.delay(post.id)
            
        # You can add logic for other platforms here as they are implemented
        # post.status = 'posting' (optional, maybe individual tasks should handle this)
        # post.save()

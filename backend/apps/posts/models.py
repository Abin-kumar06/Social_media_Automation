from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('generating', 'Generating'),
        ('generated', 'Generated'),
        ('failed', 'Failed'),
    )

    GOAL_CHOICES = (
        ('promotion', 'Promotion'),
        ('announcement', 'Announcement'),
        ('hiring', 'Hiring'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    goal = models.CharField(max_length=20, choices=GOAL_CHOICES)
    platforms = models.JSONField(default=list)  # list of platforms: instagram, linkedin, twitter
    image = models.ImageField(upload_to='post_images/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Stores generated outputs: { "instagram": {"caption": "...", "hashtags": "..."}, ... }
    generated_outputs = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Post by {self.user.username} - {self.status}"

from django.db import models
from django.contrib.auth.models import User
from .utils import EncryptionManager

class SocialAccount(models.Model):
    PLATFORM_CHOICES = (
        ('instagram', 'Instagram'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_accounts')
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    
    # Encrypted fields
    _access_token = models.TextField(db_column='access_token')
    
    expires_at = models.DateTimeField(null=True, blank=True)
    external_user_id = models.CharField(max_length=100, help_text="IG User ID")
    page_id = models.CharField(max_length=100, help_text="FB Page ID connected to IG")
    
    metadata = models.JSONField(default=dict, blank=True)
    connected_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'platform', 'external_user_id')

    @property
    def access_token(self):
        return EncryptionManager.decrypt(self._access_token)

    @access_token.setter
    def access_token(self, value):
        self._access_token = EncryptionManager.encrypt(value)

    def __str__(self):
        return f"{self.user.username} - {self.platform} ({self.external_user_id})"

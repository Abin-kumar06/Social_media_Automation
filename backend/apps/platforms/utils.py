import base64
from cryptography.fernet import Fernet
from django.conf import settings

class EncryptionManager:
    @staticmethod
    def get_fernet():
        key = getattr(settings, 'ENCRYPTION_KEY', None)
        if not key:
            # Fallback for development if not set, though it should be set in production
            key = base64.urlsafe_b64encode(b'dev-fallback-key-32-bytes-long!!!')
        return Fernet(key)

    @classmethod
    def encrypt(cls, text):
        if not text:
            return None
        f = cls.get_fernet()
        return f.encrypt(text.encode()).decode()

    @classmethod
    def decrypt(cls, encrypted_text):
        if not encrypted_text:
            return None
        f = cls.get_fernet()
        return f.decrypt(encrypted_text.encode()).decode()

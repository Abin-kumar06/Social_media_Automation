import base64
from cryptography.fernet import Fernet
from django.conf import settings

class EncryptionManager:
    @staticmethod
    def get_fernet():
        key = getattr(settings, 'ENCRYPTION_KEY', None)
        if not key:
            key = base64.urlsafe_b64encode(b'dev-fallback-key-32-bytes-long!!!').decode()
        
        # Ensure it is bytes and clean
        if isinstance(key, str):
            key = key.strip().encode()
            
        try:
            return Fernet(key)
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"ENCRYPTION ERROR: Key length is {len(key)}. Fernet key must be 32 base64-encoded bytes (44 chars).")
            raise e

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

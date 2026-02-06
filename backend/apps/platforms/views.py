from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import redirect
from django.conf import settings
from .services.instagram import InstagramService
from .models import SocialAccount
from datetime import datetime, timedelta
import pytz
import logging
import traceback

logger = logging.getLogger(__name__)

class InstagramConnectView(APIView):
    """View to redirect user to Meta OAuth"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        auth_url = InstagramService.get_auth_url()
        return Response({'url': auth_url})

class InstagramCallbackView(APIView):
    """View to handle Meta OAuth callback"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # 0. Check for errors from Meta/Facebook
        error_reason = request.query_params.get('error_reason')
        error_description = request.query_params.get('error_description')
        if error_reason:
            logger.error(f"Instagram OAuth Error: {error_reason} - {error_description}")
            frontend_url = f'http://localhost:5173/platforms?status=error&message={error_reason}: {error_description}'
            return redirect(frontend_url)

        code = request.query_params.get('code')
        if not code:
            return Response({'error': 'No code provided'}, status=status.HTTP_400_BAD_REQUEST)

        # For testing purposes in browser: if user is not authenticated, link to the first user.
        user = request.user
        if user.is_anonymous:
            from django.contrib.auth.models import User
            user = User.objects.first()
            if not user:
                return Response({'error': 'No user found in database'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 1. Exchange code for long-lived token
            logger.info(f"Exchanging code for token...")
            token_data = InstagramService.exchange_code_for_token(code)
            access_token = token_data['access_token']
            expires_in = token_data.get('expires_in', 5184000) # Default 60 days
            
            # 2. Get IG User ID and Page ID
            logger.info(f"Getting user info...")
            ig_info = InstagramService.get_user_info(access_token)
            
            # 3. Store or update SocialAccount
            expires_at = datetime.now(pytz.UTC) + timedelta(seconds=expires_in)
            
            logger.info(f"Saving social account for user {user.id}...")
            social_account, created = SocialAccount.objects.update_or_create(
                user=user,
                platform='instagram',
                external_user_id=ig_info['ig_user_id'],
                defaults={
                    'access_token': access_token,
                    'page_id': ig_info['page_id'],
                    'expires_at': expires_at,
                    'metadata': token_data
                }
            )
            
            logger.info(f"Instagram connected successfully for user {user.id}")
            # Redirect to frontend with success status
            frontend_url = 'http://localhost:5173/platforms?status=success'
            return redirect(frontend_url)

        except Exception as e:
            logger.error(f"Error in Instagram callback: {str(e)}")
            logger.error(traceback.format_exc())
            # Redirect to frontend with error status
            frontend_url = f'http://localhost:5173/platforms?status=error&message={str(e)}'
            return redirect(frontend_url)


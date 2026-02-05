import requests
from django.conf import settings
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class InstagramService:
    @classmethod
    def _get_config(cls):
        return {
            'base_url': getattr(settings, 'META_GRAPH_BASE', 'https://graph.facebook.com/v19.0'),
            'app_id': getattr(settings, 'META_APP_ID', None),
            'app_secret': getattr(settings, 'META_APP_SECRET', None),
            'redirect_uri': getattr(settings, 'META_REDIRECT_URI', None),
        }

    @classmethod
    def get_auth_url(cls):
        """Generate Meta OAuth URL"""
        config = cls._get_config()
        from urllib.parse import urlencode

        # Only use permissions that don't require App Review
        scopes = [
            'instagram_basic',
            'instagram_content_publish',
            'pages_read_engagement',
            'pages_show_list',
        ]
        
        params = {
            'client_id': config['app_id'],
            'redirect_uri': config['redirect_uri'],
            'scope': ','.join(scopes),
            'response_type': 'code',
            'auth_type': 'rerequest',
            'display': 'popup'
        }
        
        auth_url = f"https://www.facebook.com/v19.0/dialog/oauth?{urlencode(params)}"
        return auth_url

    @classmethod
    def exchange_code_for_token(cls, code):
        """Exchange auth code for long-lived token"""
        config = cls._get_config()
        # 1. Get short-lived token
        token_url = f"{config['base_url']}/oauth/access_token"
        params = {
            'client_id': config['app_id'],
            'client_secret': config['app_secret'],
            'redirect_uri': config['redirect_uri'],
            'code': code
        }
        response = requests.get(token_url, params=params)
        data = response.json()
        
        if 'error' in data:
            logger.error(f"Error getting short-lived token: {data}")
            raise Exception(data['error'].get('message', 'Failed to get access token'))

        short_token = data['access_token']

        # 2. Exchange for long-lived token
        exchange_url = f"{config['base_url']}/oauth/access_token"
        params = {
            'grant_type': 'fb_exchange_token',
            'client_id': config['app_id'],
            'client_secret': config['app_secret'],
            'fb_exchange_token': short_token
        }
        response = requests.get(exchange_url, params=params)
        data = response.json()
        
        if 'error' in data:
            logger.error(f"Error getting long-lived token: {data}")
            raise Exception(data['error'].get('message', 'Failed to get long-lived token'))

        return data

    @classmethod
    def get_user_info(cls, access_token):
        """Get IG Business User ID and Page ID"""
        config = cls._get_config()
        
        # Debug: Log the access token (partially masked)
        masked_token = access_token[:10] + "..." + access_token[-10:] if len(access_token) > 20 else "***"
        logger.info(f"Using access token: {masked_token}")

        # DEBUG: Check User Identity
        user_url = f"{config['base_url']}/me"
        user_response = requests.get(user_url, params={'access_token': access_token})
        logger.info(f"User Info: {user_response.json()}")
        print(f"DEBUG: User Info -> {user_response.json()}")

        # DEBUG: Check Granted Permissions
        perm_url = f"{config['base_url']}/me/permissions"
        perm_response = requests.get(perm_url, params={'access_token': access_token})
        logger.info(f"Granted Permissions: {perm_response.json()}")
        print(f"DEBUG: Granted Permissions -> {perm_response.json()}")
        
        # 1. Get user's managed pages
        pages_url = f"{config['base_url']}/me/accounts"
        params = {
            'access_token': access_token,
            'fields': 'id,name,access_token,instagram_business_account',
            'limit': 100
        }
        
        logger.info(f"Requesting pages from: {pages_url}")
        response = requests.get(pages_url, params=params)
        
        # Log response status and headers
        logger.info(f"Response status: {response.status_code}")
        
        data = response.json()
        
        logger.info(f"Full API Response: {data}")
        print(f"\n{'='*80}")
        print(f"DEBUG: Meta /me/accounts Response:")
        print(f"Status Code: {response.status_code}")
        print(f"Response Data: {data}")
        print(f"{'='*80}\n")
        
        # Check for API errors
        if 'error' in data:
            error_msg = data['error'].get('message', 'Unknown error')
            error_code = data['error'].get('code', 'N/A')
            logger.error(f"Facebook API Error: {error_msg} (Code: {error_code})")
            raise Exception(f"Facebook API Error: {error_msg}")
        
        if 'data' not in data or not data['data']:
            logger.warning("No pages list returned. Checking if the authenticated user IS a page...")
            
            # Fallback: Check if the current "me" is actually the page we want
            me_url = f"{config['base_url']}/me"
            me_params = {
                'fields': 'id,name,instagram_business_account',
                'access_token': access_token
            }
            me_response = requests.get(me_url, params=me_params).json()
            logger.info(f"Checking /me context: {me_response}")
            
            if 'instagram_business_account' in me_response:
                logger.info(f"The authenticated user is the Page! Using direct access.")
                return {
                    'page_id': me_response['id'],
                    'ig_user_id': me_response['instagram_business_account']['id'],
                }
            
            logger.error(f"Fallback failed. Me Response: {me_response}")
            raise Exception(f"No pages found. Fallback Context: {me_response}")

        logger.info(f"Found {len(data['data'])} page(s)")
        
        # For production, we might want the user to select which page. 
        # For simplicity, we'll take the first page that has an IG Business Account.
        for page in data['data']:
            page_id = page['id']
            page_name = page.get('name', 'Unknown')
            
            logger.info(f"Checking Page: '{page_name}' (ID: {page_id})")
            
            # Check if instagram_business_account is already in the response
            if 'instagram_business_account' in page:
                ig_account = page['instagram_business_account']
                logger.info(f"Found IG Business Account in page data: {ig_account}")
                return {
                    'page_id': page_id,
                    'ig_user_id': ig_account['id'],
                }
            
            # If not, make a separate request
            ig_url = f"{config['base_url']}/{page_id}"
            params = {
                'fields': 'instagram_business_account',
                'access_token': access_token
            }
            ig_response = requests.get(ig_url, params=params).json()
            
            logger.info(f"Checking Page '{page_name}' ({page_id}) for IG account: {ig_response}")
            print(f"DEBUG: Checking Page '{page_name}' ({page_id}) for IG account -> {ig_response}")
            
            if 'instagram_business_account' in ig_response:
                return {
                    'page_id': page_id,
                    'ig_user_id': ig_response['instagram_business_account']['id'],
                }
        
        raise Exception(f"No Instagram Business Account linked to the managed Facebook pages ({len(data['data'])} pages found).")

    @classmethod
    def create_media_container(cls, ig_user_id, access_token, image_url, caption):
        """Step 1: Create a media container"""
        config = cls._get_config()
        # If META_TEST_IMAGE is set, use it instead of the local URL
        test_image = getattr(settings, 'META_TEST_IMAGE', None)
        if test_image:
            image_url = test_image
            logger.info(f"Using test image URL: {image_url}")

        url = f"{config['base_url']}/{ig_user_id}/media"
        payload = {
            'image_url': image_url,
            'caption': caption,
            'access_token': access_token
        }
        response = requests.post(url, data=payload)
        data = response.json()
        
        if 'id' not in data:
            logger.error(f"Error creating media container: {data}")
            raise Exception(data.get('error', {}).get('message', 'Failed to create media container'))
        
        return data['id']

    @classmethod
    def publish_media(cls, ig_user_id, access_token, creation_id):
        """Step 2: Publish the media container"""
        config = cls._get_config()
        url = f"{config['base_url']}/{ig_user_id}/media_publish"
        payload = {
            'creation_id': creation_id,
            'access_token': access_token
        }
        response = requests.post(url, data=payload)
        data = response.json()
        
        if 'id' not in data:
            logger.error(f"Error publishing media: {data}")
            raise Exception(data.get('error', {}).get('message', 'Failed to publish media'))
        
        return data['id']

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
    def debug_token(cls, access_token):
        """Introspect token to check permissions and targets"""
        config = cls._get_config()
        url = f"{config['base_url']}/debug_token"
        params = {
            'input_token': access_token,
            'access_token': f"{config['app_id']}|{config['app_secret']}"
        }
        try:
            response = requests.get(url, params=params).json()
            data = response.get('data', {})
            logger.info(f"Token Debug Info: {data}")
            return data
        except Exception as e:
            logger.warning(f"Could not debug token: {str(e)}")
            return {}

    @classmethod
    def get_user_info(cls, access_token):
        """Get IG Business User ID and Page ID"""
        config = cls._get_config()
        
    @classmethod
    def get_user_info(cls, access_token):
        """Get IG Business User ID and Page ID"""
        config = cls._get_config()
        
        # 0. Introspect the token
        debug_info = cls.debug_token(access_token)
        
        # 1. Strategy A: Standard /me/accounts
        pages_url = f"{config['base_url']}/me/accounts"
        params = {
            'access_token': access_token,
            'fields': 'id,name,instagram_business_account',
            'limit': 100
        }
        
        response = requests.get(pages_url, params=params)
        data = response.json()
        
        # 2. Strategy B: Nested /me?fields=accounts
        if not data.get('data'):
            me_acc_url = f"{config['base_url']}/me"
            me_acc_params = {
                'fields': 'accounts{id,name,instagram_business_account}',
                'access_token': access_token
            }
            try:
                me_acc_response = requests.get(me_acc_url, params=me_acc_params).json()
                if 'accounts' in me_acc_response:
                    data = me_acc_response['accounts']
            except Exception:
                pass

        # 3. Strategy C: Metadata Extraction (The most reliable for Dev mode)
        if not data.get('data'):
            granular_scopes = debug_info.get('granular_scopes', [])
            page_id = None
            ig_user_id = None
            
            for item in granular_scopes:
                scope = item.get('scope')
                target_ids = item.get('target_ids', [])
                if scope == 'pages_show_list' and target_ids:
                    page_id = target_ids[0]
                if scope == 'instagram_basic' and target_ids:
                    ig_user_id = target_ids[0]
            
            if page_id and ig_user_id:
                logger.info(f"Instagram Account Found via Token Metadata (Page: {page_id}, IG: {ig_user_id})")
                return {
                    'page_id': page_id,
                    'ig_user_id': ig_user_id,
                }

        if 'error' in data:
            raise Exception(f"Facebook API Error: {data['error'].get('message', 'Unknown error')}")
        
        if 'data' not in data or not data['data']:
            raise Exception(
                "Meta is still returning 0 Pages. This is likely a Meta App configuration issue (Advanced Access required)."
            )

        logger.info(f"Checking {len(data['data'])} found page(s) for linked IG accounts...")
        
        for page in data['data']:
            page_id = page['id']
            if 'instagram_business_account' in page:
                ig_account = page['instagram_business_account']
                logger.info(f"Instagram Account Found: {ig_account['id']} on Page {page_id}")
                return {
                    'page_id': page_id,
                    'ig_user_id': ig_account['id'],
                }
        
        raise Exception("Found Facebook Page(s) but none are linked to an Instagram Business account.")
        
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

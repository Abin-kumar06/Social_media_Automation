# Social Media Automation Backend

A Django-based backend for AI-powered social media content generation.

## Features
- JWT Authentication
- Image Upload Support
- Background Processing with Celery & Redis
- Local AI Generation via Ollama

## Setup Instructions

### 1. Prerequisites
- Python 3.10+
- Redis Server (local or Docker)
- Ollama (running locally)

### 2. Installation
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and update the values if necessary.

### 4. Database Setup
```bash
python manage.py migrate
python manage.py createsuperuser
```

### 5. Running the Application

#### Run Django Server
```bash
python manage.py runserver
```

#### Run Redis (if using Docker)
```bash
docker run -d -p 6379:6379 redis
```

#### Run Celery Worker
```bash
celery -A social_media worker --loglevel=INFO
```

### 6. AI Engine
Ensure Ollama is running and the model (default: `llama3`) is pulled:
```bash
ollama pull llama3
```

## 📸 Instagram Integration

### 1. Meta App Setup
1. Go to [Meta for Developers](https://developers.facebook.com/).
2. Create a new App (Type: Business).
3. Add **Instagram Graph API** and **Facebook Login for Business** products.
4. Go to **Settings > Basic** to get your `App ID` and `App Secret`.
5. Under **App Review > Permissions**, ensure you have:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
   - `pages_show_list`
6. Add `http://localhost:8000/api/platforms/instagram/callback/` to the Valid OAuth Redirect URIs in Facebook Login settings.

### 2. Environment Variables
Update your `.env` file:
```text
META_APP_ID=your_id
META_APP_SECRET=your_secret
META_REDIRECT_URI=http://localhost:8000/api/platforms/instagram/callback/
SITE_URL=http://your_ngrok_or_public_url_if_not_local
ENCRYPTION_KEY=your_fernet_key # Generate using: base64.urlsafe_b64encode(os.urandom(32))
```

### 3. API Usage
1. **Connect**: `GET /api/platforms/instagram/connect/` → returns OAuth URL.
2. **Callback**: Handles code exchange and saves `SocialAccount`.
3. **Publish**: Celery task `publish_instagram_post(post_id)` handles posting.

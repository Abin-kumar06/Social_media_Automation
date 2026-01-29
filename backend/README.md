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

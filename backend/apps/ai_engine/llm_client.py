import requests
import json
from django.conf import settings
import environ

env = environ.Env()

class OllamaClient:
    def __init__(self):
        self.base_url = env('OLLAMA_BASE_URL', default='http://localhost:11434').rstrip('/')
        self.model = env('OLLAMA_MODEL', default='llama3')
        self.timeout = int(env('OLLAMA_TIMEOUT', default=60))

    def generate(self, prompt):
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        
        try:
            response = requests.post(url, json=payload, timeout=self.timeout)
            response.raise_for_status()
            return response.json().get('response', '')
        except requests.exceptions.Timeout:
            raise Exception(f"Ollama request timed out after {self.timeout}s")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Ollama connection failed: {str(e)}")

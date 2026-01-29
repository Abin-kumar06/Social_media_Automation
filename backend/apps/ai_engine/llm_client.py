import requests
import json
from django.conf import settings
import environ

env = environ.Env()

class OllamaClient:
    def __init__(self):
        self.base_url = env('OLLAMA_BASE_URL', default='http://localhost:11434')
        self.model = env('OLLAMA_MODEL', default='llama3')

    def generate(self, prompt):
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        
        try:
            response = requests.post(url, json=payload, timeout=60)
            response.raise_for_status()
            return response.json().get('response', '')
        except requests.exceptions.RequestException as e:
            print(f"Ollama generation failed: {e}")
            raise e

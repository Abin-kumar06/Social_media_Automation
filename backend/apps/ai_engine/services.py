import os
from django.conf import settings
from .llm_client import OllamaClient

class PostGenerationService:
    def __init__(self):
        self.client = OllamaClient()
        self.prompts_path = os.path.join(settings.BASE_DIR, 'apps', 'ai_engine', 'prompts')

    def _read_prompt_file(self, filename):
        path = os.path.join(self.prompts_path, filename)
        with open(path, 'r') as f:
            return f.read()

    def generate_all_platforms(self, post):
        results = {}
        
        # Step 1: Generate base refined content
        base_prompt_template = self._read_prompt_file('base.txt')
        base_prompt = base_prompt_template.format(
            content=post.content,
            goal=post.goal
        )
        base_content = self.client.generate(base_prompt)
        
        # Step 2: Generate platform specific versions
        for platform in post.platforms:
            try:
                platform_prompt_template = self._read_prompt_file(f'{platform}.txt')
            except FileNotFoundError:
                platform_prompt_template = "Rewrite the following for {platform}: {base_content}"
            
            platform_prompt = platform_prompt_template.format(
                base_content=base_content,
                platform=platform
            )
            
            output = self.client.generate(platform_prompt)
            # Simple parsing: expect a JSON-like or structured response from LLM
            # Here we just treat the whole response as caption for MVP
            results[platform] = {
                "caption": output,
                "hashtags": [] # Could be parsed from output
            }
            
        return results

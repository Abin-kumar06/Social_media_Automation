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

    def _parse_llm_output(self, output):
        """Parse LLM output into caption and hashtags"""
        caption = ""
        hashtags = ""
        
        lines = output.strip().split('\n')
        for line in lines:
            if line.upper().startswith('CAPTION:'):
                caption = line.replace('CAPTION:', '').strip()
            elif line.upper().startswith('HASHTAGS:'):
                hashtags = line.replace('HASHTAGS:', '').strip()
        
        # Fallback if parsing fails
        if not caption:
            # If no label, assume the whole first part is caption
            caption = output.split('HASHTAGS:')[0].strip()
        
        return caption, hashtags

    def generate_all_platform_text(self, post):
        """Generate base caption and platform-specific versions"""
        # Step 1: Generate base refined content
        base_prompt_template = self._read_prompt_file('base.txt')
        base_prompt = base_prompt_template.format(
            content=post.content,
            goal=post.goal
        )
        base_caption = self.client.generate(base_prompt)
        post.base_caption = base_caption
        
        # Step 2: Generate platform specific versions
        for platform in post.platforms:
            try:
                platform_prompt_template = self._read_prompt_file(f'{platform}.txt')
            except FileNotFoundError:
                continue
            
            platform_prompt = platform_prompt_template.format(base_content=base_caption)
            output = self.client.generate(platform_prompt)
            
            caption, hashtags = self._parse_llm_output(output)
            
            # Save to specific fields
            setattr(post, f"{platform}_caption", caption)
            setattr(post, f"{platform}_hashtags", hashtags)
        
        post.status = 'generated'
        post.save()
        return True

import os
import time
import requests
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
SARVAM_API_KEY = os.environ.get("SARVAM_API_KEY")

class LLMClient:
    def __init__(self):
        self.gemini_client = genai.Client(api_key=GOOGLE_API_KEY)
        self.gemini_models = [
            'gemini-2.0-flash', 
            'gemini-2.0-flash-lite',
            'gemini-2.5-flash',
            'gemini-flash-latest',
            'gemini-pro-latest'
        ]

    def _call_sarvam(self, prompt: str):
        """Calls the Sarvam AI Chat Completion API."""
        if not SARVAM_API_KEY:
            print("Sarvam API Key is MISSING in environment.")
            return None
            
        print(f"Attempting generation with Sarvam AI (using sarvam-105b)...")
        url = "https://api.sarvam.ai/v1/chat/completions"
        headers = {
            "api-subscription-key": SARVAM_API_KEY,
            "Content-Type": "application/json"
        }
        data = {
            "model": "sarvam-105b", 
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.1,
            "max_tokens": 4096
        }
        
        try:
            response = requests.post(url, headers=headers, json=data, timeout=60)
            print(f"Sarvam API Status: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                message = result["choices"][0]["message"]
                content = message.get("content")
                    
                if not content:
                    print(f"Sarvam API Warning: Received empty response. Full result: {result}")
                return content
            else:
                print(f"Sarvam AI Error: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            print(f"Sarvam API Exception: {e}")
            return None

    def safe_generate(self, prompt: str, temperature: float = 0.1):
        last_error = "Unknown Error"
        
        # Try Sarvam AI first
        try:
            sarvam_res = self._call_sarvam(prompt)
            if sarvam_res:
                cleaned = self._clean_text(sarvam_res)
                # Test parse to be sure
                json.loads(cleaned)
                return cleaned
            last_error = "Sarvam AI returned empty response"
        except Exception as e:
            last_error = f"Sarvam parsing failed: {str(e)}"
            if sarvam_res:
                print(f"PARSE ERROR. Sample: {sarvam_res[:200]}...")
            
        # Fallback to Gemini rotation (re-enabled for robustness)
        if GOOGLE_API_KEY:
            for model_name in self.gemini_models:
                try:
                    print(f"Attempting fallback with Gemini ({model_name})...")
                    res = self.gemini_client.models.generate_content(
                        model=model_name,
                        contents=prompt
                    )
                    if res.text:
                        cleaned = self._clean_text(res.text)
                        json.loads(cleaned)
                        return cleaned
                except Exception as e:
                    last_error = f"Gemini ({model_name}) failed: {str(e)}"
                    continue
                
        print(f"!!! ALL MODELS FAILED !!! Using empty fallback JSON. Last error: {last_error}")
        return "{}"

    def _clean_text(self, text: str):
        """Robustly extracts JSON from LLM output, even with preamble/markdown."""
        # 1. Remove markdown code blocks if present
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
        
        # 2. Find the first '{' and last '}' to extract the JSON object
        start_idx = text.find('{')
        end_idx = text.rfind('}')
        
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            text = text[start_idx:end_idx + 1]
        
        # 3. Basic sanitization
        text = text.strip()
        
        # 4. Remove non-printable control characters
        import re
        text = re.sub(r'[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f-\xff]', '', text)
        
        # 5. Clean up common AI hallucinations in JSON
        text = re.sub(r',\s*([}\]])', r'\1', text)
        
        return text

# Singleton instance
ai = LLMClient()

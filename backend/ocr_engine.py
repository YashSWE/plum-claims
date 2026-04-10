import requests
import io
import os
import hashlib
from dotenv import load_dotenv

load_dotenv()

class OCREngine:
    def __init__(self):
        self.api_key = os.environ.get("OCR_SPACE_API_KEY")
        self.api_url = "https://api.ocr.space/parse/image"
        self.cache_dir = os.path.join(os.path.dirname(__file__), ".ocr_cache")
        
        # Ensure cache directory exists
        if not os.path.exists(self.cache_dir):
            os.makedirs(self.cache_dir)

    def _get_cache_path(self, file_content: bytes) -> str:
        """Generates a unique cache path based on the file content hash."""
        file_hash = hashlib.md5(file_content).hexdigest()
        return os.path.join(self.cache_dir, f"{file_hash}.txt")

    def extract_text(self, file_content: bytes, filename: str) -> str:
        """Extracts text from images or PDFs using the OCR.space Cloud API with disk caching."""
        if not self.api_key:
             return "[Error] OCR.space API Key missing."
        
        cache_path = self._get_cache_path(file_content)
        
        # Check cache first
        if os.path.exists(cache_path):
            print(f"CACHE HIT: Using local OCR result for {filename}")
            with open(cache_path, "r", encoding="utf-8") as f:
                return f.read()

        try:
            print(f"CACHE MISS: Calling OCR API for {filename}...")
            # Prepare the file for the multipart/form-data request
            files = {
                'file': (filename, io.BytesIO(file_content))
            }
            
            payload = {
                'apikey': self.api_key,
                'language': 'eng',
                'isOverlayRequired': False,
                'filetype': filename.split('.')[-1].upper(),
                'detectOrientation': True,
                'isTable': True, # Good for medical bills
                'scale': True
            }
            
            response = requests.post(self.api_url, data=payload, files=files)
            result = response.json()
            
            if result.get("IsErroredOnProcessing"):
                return f"[OCR Error] {result.get('ErrorMessage')}"
                
            parsed_results = result.get("ParsedResults", [])
            extracted_text = ""
            for res in parsed_results:
                extracted_text += res.get("ParsedText", "") + "\n"
            
            final_text = extracted_text.strip() if extracted_text.strip() else f"No text found in {filename}"
            
            # Save to cache if successful
            if final_text and not final_text.startswith("[OCR Error]"):
                with open(cache_path, "w", encoding="utf-8") as f:
                    f.write(final_text)
                    
            return final_text
            
        except Exception as e:
            print(f"OCR.space Error for {filename}: {e}")
            return f"[OCR Fallback] API Error: {str(e)}"

# Singleton
ocr = OCREngine()

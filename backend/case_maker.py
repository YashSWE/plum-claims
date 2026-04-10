import os
import json
from google import genai
from models import CaseInput
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

def parse_documents_to_case(member_info: dict, documents_texts: list) -> CaseInput:
    """Passes OCR text or logic to Gemini to structured into CaseInput."""
    if not GOOGLE_API_KEY:
         # Mock return for testing without API
         print("No Google API Key, returning mock data")
         return CaseInput(**{"member_id": member_info.get('member_id', 'Unknown'), "member_name": member_info.get('member_name', 'Unknown'), "treatment_date": "2024-01-01", "claim_amount": 0.0, "documents": {}})
         
    prompt = f"""
    You are an expert medical claim processor. Extract the following member info and descriptions text from documents into a strict JSON matching this schema:
    Schema:
    {{
      "member_id": "str",
      "member_name": "str",
      "treatment_date": "YYYY-MM-DD",
      "claim_amount": float,
      "previous_claims_same_day": int,
      "hospital": "str",
      "cashless_request": bool,
      "documents": {{
        "prescription": {{
           "doctor_name": "str",
           "doctor_reg": "str",
           "diagnosis": "str",
           "medicines_prescribed": ["str"],
           "procedures": ["str"],
           "tests_prescribed": ["str"]
        }},
        "bill": {{
           "consultation_fee": float,
           "diagnostic_tests": float,
           "medicines": float,
           "root_canal": float,
           "teeth_whitening": float,
           "mri_scan": float
        }}
      }}
    }}
    
    Member Info Provided by User Context: {json.dumps(member_info)}
    Texts to extract from: {json.dumps(documents_texts)}
    
    Return ONLY valid JSON without formatting markdown.
    """
    
    client = genai.Client(api_key=GOOGLE_API_KEY)
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    response_text = response.text.replace("```json", "").replace("```", "").strip()
    
    try:
        parsed_data = json.loads(response_text)
        case_input = CaseInput(**parsed_data)
        return case_input
    except Exception as e:
        print(f"Failed to parse LLM output: {e}\nRaw output: {response_text}")
        raise

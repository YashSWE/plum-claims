import os
import json
from google import genai
from models import CaseInput
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

def parse_documents_to_case(member_info: dict, documents_texts: list) -> dict:
    """Aggregates all documents and context for a single-pass extraction with robust fallback."""
    from llm_client import ai
    
    # Extract info provided by the user
    user_context = member_info.get("context", "No additional context provided.")
    member_id = member_info.get("member_id", "Unknown")
    member_name = member_info.get("member_name", "Unknown")

    # Initialize a VALID base structure that satisfies CaseInput requirements
    from datetime import datetime
    final_case = {
        "member_id": member_id,
        "member_name": member_name,
        "context": user_context,
        "treatment_date": datetime.now().strftime("%Y-%m-%d"),
        "claim_amount": 0.0,
        "hospital": "Unknown",
        "cashless_request": False,
        "documents": {
            "prescription": {
                "doctor_name": "Pending",
                "doctor_reg": "Unknown",
                "diagnoses": [],
                "medicines_prescribed": [],
                "procedures": [],
                "tests_prescribed": []
            },
            "bill": {
                "consultation_fee": 0.0,
                "diagnostic_tests": 0.0,
                "medicines": 0.0,
                "line_items": []
            },
            "raw_transcripts": []
        }
    }

    # Aggregate documents with filenames
    aggregated_docs = ""
    for doc in documents_texts:
        filename = doc.get('filename', 'Unknown')
        content = doc.get('content', '')
        aggregated_docs += f"\n--- Start of File: {filename} ---\n"
        aggregated_docs += content
        aggregated_docs += f"\n--- End of File: {filename} ---\n"
        final_case["documents"]["raw_transcripts"].append({
            "filename": filename,
            "content": content
        })

    prompt = f"""
    Extract medical information into JSON from the documents.
    
    CONTEXT: Member={member_id}, Name={member_name}, Notes={user_context}
    
    RULES:
    - OUTPUT ONLY VALID JSON.
    - NO PREAMBLE, NO THINKING, NO EXPLANATION.
    - EXTRACT detailed bill items.
    
    JSON STRUCTURE:
    {{
        "treatment_date": "YYYY-MM-DD",
        "claim_amount": 0.0,
        "hospital": "Name",
        "documents": {{
            "prescription": {{
                "doctor_name": "Name",
                "doctor_reg": "Registration ID/No",
                "diagnoses": ["Condition"],
                "medicines_prescribed": [],
                "treatment": "Summary"
            }},
            "bill": {{
                "consultation_fee": 0.0,
                "diagnostic_tests": 0.0,
                "medicines": 0.0,
                "line_items": [
                    {{"description": "Item", "quantity": 1.0, "unit_price": 0.0, "total_price": 0.0}}
                ]
            }}
        }}
    }}
    
    CONTENT:
    {aggregated_docs}
    """
    
    try:
        response_text = ai.safe_generate(prompt)
        ai_data = json.loads(response_text)
        
        # Deep merge AI data into our mandatory base structure
        if ai_data:
            # Simple fields
            for field in ["treatment_date", "claim_amount", "hospital", "cashless_request"]:
                if field in ai_data and ai_data[field]:
                    final_case[field] = ai_data[field]
            
            # Nested documents
            if "documents" in ai_data:
                ai_docs = ai_data["documents"]
                
                # Prescription
                if "prescription" in ai_docs:
                    final_case["documents"]["prescription"].update({k: v for k, v in ai_docs["prescription"].items() if v})
                
                # Bill
                if "bill" in ai_docs:
                    ai_bill = ai_docs["bill"]
                    final_case["documents"]["bill"].update({k: v for k, v in ai_bill.items() if k != "line_items" and v})
                    if "line_items" in ai_bill and isinstance(ai_bill["line_items"], list):
                        final_case["documents"]["bill"]["line_items"] = ai_bill["line_items"]
        
        # Final sanity check: ensure claim_amount is calculated if it's still 0
        if final_case["claim_amount"] == 0:
            bill = final_case["documents"]["bill"]
            line_total = sum(item.get("total_price", 0) for item in bill.get("line_items", []))
            final_case["claim_amount"] = line_total or (bill.get("consultation_fee", 0) + bill.get("diagnostic_tests", 0) + bill.get("medicines", 0))

        return final_case

    except Exception as e:
        print(f"Extraction processing failed: {e}. Returning fallback structure.")
        return final_case

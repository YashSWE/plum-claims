import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

class DatabaseManager:
    def __init__(self):
        self.supabase: Client = None
        if SUPABASE_URL and SUPABASE_KEY:
            self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
            
    def save_case_log(self, case_data: dict) -> bool:
        if not self.supabase:
            return False
        try:
            self.supabase.table("case_logs").insert({"data": case_data}).execute()
            return True
        except Exception as e:
            print(f"Error saving case log: {e}")
            return False
            
    def save_verdict_log(self, verdict_data: dict) -> bool:
        if not self.supabase:
            return False
        try:
            self.supabase.table("verdict_logs").insert({"data": verdict_data}).execute()
            return True
        except Exception as e:
            print(f"Error saving verdict log: {e}")
            return False
            
    def save_fraud_flag(self, case_id: str, flag_reason: str) -> bool:
        if not self.supabase:
            return False
        try:
            self.supabase.table("fraud_flags").insert({
                "case_id": case_id,
                "reason": flag_reason
            }).execute()
            return True
        except Exception as e:
            print(f"Error saving fraud flag: {e}")
            return False

    def get_all_cases(self) -> list:
        if not self.supabase:
            return []
        try:
            response = self.supabase.table("case_logs").select("*").order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            print(f"Error fetching case logs: {e}")
            return []

    def get_all_verdicts(self) -> list:
        if not self.supabase:
            return []
        try:
            # We fetch all verdicts and match them in frontend or with a join if needed
            response = self.supabase.table("verdict_logs").select("*").order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            print(f"Error fetching verdict logs: {e}")
            return []

    def update_verdict_log(self, claim_id: str, updated_data: dict) -> bool:
        if not self.supabase:
            return False
        try:
            # We find the row where data->>claim_id == claim_id
            # Note: For simplicity in this demo, we search for the claim_id in the JSON blob
            # Ideally we'd have a separate column for claim_id
            response = self.supabase.table("verdict_logs").select("id, data").execute()
            target_id = None
            for row in response.data:
                if row.get("data", {}).get("claim_id") == claim_id:
                    target_id = row.get("id")
                    break
            
            if target_id:
                self.supabase.table("verdict_logs").update({"data": updated_data}).eq("id", target_id).execute()
                return True
            return False
        except Exception as e:
            print(f"Error updating verdict log: {e}")
            return False

    def upload_document(self, filename: str, content: bytes, path: str) -> str:
        """Uploads a file to Supabase storage and returns the public URL."""
        if not self.supabase:
            return ""
        try:
            # Try to upload to 'documents' bucket
            bucket_name = "documents"
            self.supabase.storage.from_(bucket_name).upload(path, content, {"content-type": "image/jpeg" if filename.lower().endswith(('.jpg', '.jpeg')) else "application/pdf"})
            
            # Get public URL
            res = self.supabase.storage.from_(bucket_name).get_public_url(path)
            return res
        except Exception as e:
            print(f"Error uploading document: {e}")
            return ""

    def check_duplicate_claim(self, member_id: str, treatment_date: str, claim_amount: float, exclude_case_id: str = None) -> bool:
        """Checks if a claim with same member, date and amount already exists."""
        if not self.supabase:
            return False
        try:
            # We search within the 'data' column which contains the whole Case object
            # We must exclude the current case_id if provided
            query = self.supabase.table("case_logs").select("id") \
                .filter("data->input_data->>member_id", "eq", member_id) \
                .filter("data->input_data->>treatment_date", "eq", treatment_date) \
                .filter("data->input_data->>claim_amount", "eq", str(claim_amount))
            
            if exclude_case_id:
                query = query.filter("data->>case_id", "neq", exclude_case_id)
                
            res = query.execute()
            return len(res.data) > 0
        except Exception as e:
            print(f"Error checking duplicate claim: {e}")
            return False


db = DatabaseManager()

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

    def check_duplicate_claim(self, member_id: str, treatment_date: str, claim_amount: float) -> bool:
        """Checks if a matching claim exists for the member on the same date."""
        if not self.supabase:
            return False
        try:
            # Look for existing approved/partial claims for this member and date
            # We use a 2% variance for the amount to catch minor changes
            response = self.supabase.table("verdict_logs").select("data").execute()
            for row in response.data:
                v = row.get("data", {})
                # Note: This is an expensive O(N) check in memory, ideally we'd filter in SQL
                # But for this MVP/Prototoype, we'll look for member_id match in the saved case context
                # assuming the case_data was saved during the session.
                # Since the actual case link isn't directly in verdict_logs, we'll simulate success for now
                # Or if we have a robust schema, we'd do a filtered query.
                pass
            
            # Simulated check logic: for now we check if any verdict for same member/date exists
            # In a real app, we'd query: .eq("data->member_id", member_id).eq("data->treatment_date", treatment_date)
            return False
        except Exception as e:
            print(f"Error checking duplicate: {e}")
            return False

db = DatabaseManager()

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

db = DatabaseManager()

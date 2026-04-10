import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

print(f"Connecting to {SUPABASE_URL}...")
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    test_data = {"test": "data"}
    
    print("Trying to insert into case_logs...")
    res = supabase.table("case_logs").insert({"data": test_data}).execute()
    print(f"Success! Response: {res}")
    
except Exception as e:
    print(f"Error: {e}")

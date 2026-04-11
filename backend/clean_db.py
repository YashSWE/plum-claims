import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

DB_URL = os.environ.get("SUPABASE_DB_URL")

def clean_database():
    if not DB_URL:
        print("No SUPABASE_DB_URL found in .env")
        return

    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()

        print("Deleting data from Supabase tables...")
        
        # Truncate tables to remove all records and reset identity counters if possible
        cur.execute("TRUNCATE TABLE case_logs RESTART IDENTITY CASCADE;")
        cur.execute("TRUNCATE TABLE verdict_logs RESTART IDENTITY CASCADE;")
        cur.execute("TRUNCATE TABLE fraud_flags RESTART IDENTITY CASCADE;")

        conn.commit()
        cur.close()
        conn.close()
        print("Database cleaned successfully! Starting fresh.")
    except Exception as e:
        print("Database cleanup error:", e)

if __name__ == "__main__":
    clean_database()

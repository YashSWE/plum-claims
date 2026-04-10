import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

DB_URL = os.environ.get("SUPABASE_DB_URL")

def init_db():
    if not DB_URL:
        print("No SUPABASE_DB_URL found in .env")
        return

    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()

        # Create case_logs table
        cur.execute('''
            CREATE TABLE IF NOT EXISTS case_logs (
                id SERIAL PRIMARY KEY,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                data JSONB NOT NULL
            );
        ''')

        # Create verdict_logs table
        cur.execute('''
            CREATE TABLE IF NOT EXISTS verdict_logs (
                id SERIAL PRIMARY KEY,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                data JSONB NOT NULL
            );
        ''')

        # Create fraud_flags table
        cur.execute('''
            CREATE TABLE IF NOT EXISTS fraud_flags (
                id SERIAL PRIMARY KEY,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                case_id TEXT NOT NULL,
                reason TEXT NOT NULL
            );
        ''')

        conn.commit()
        cur.close()
        conn.close()
        print("Supabase tables created successfully!")
    except Exception as e:
        print("Database initialization error:", e)

if __name__ == '__main__':
    init_db()

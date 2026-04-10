# Plum Claim Engine Backend

This is the FastAPI backend for the Plum Claim Engine. It includes the Case Maker pipeline and the Adjudication Engine.

## Setup Instructions

1. Navigate safely to `backend` directory.
2. Create a virtual environment: `python3 -m venv venv`
3. Activate: `source venv/bin/activate`
4. Install requirements: `pip install -r requirements.txt`
5. Run locally: `uvicorn application:app --reload`

Ensure that you fill out the `.env` file first with the valid `SUPABASE_KEY` or valid `DB_CONNECTION_STRING` depending on the implementation used.

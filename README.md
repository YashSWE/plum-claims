# Plum Claim Engine - AI-Powered OPD Adjudication

A premium, rule-compliant insurance claim adjudication system designed for the Plum intern assignment. This engine leverages advanced AI for document intelligence and enforces complex medical insurance policies with transparency and speed.

## 🚀 Quick Start

### Backend (FastAPI)
1. Navigate to `backend/`
2. Create and activate a virtual environment: `python3 -m venv venv && source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Set up `.env` with `GOOGLE_API_KEY`, `SARVAM_API_KEY`, `SUPABASE_URL`, and `SUPABASE_KEY`.
5. Run the server: `uvicorn application:app --port 8008`

### Frontend (Next.js)
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Access at `http://localhost:3000`

## 🧠 Key Features

- **Multi-Phase Adjudication**: Sequential logic enforcing integrity, consistency, eligibility, and limits.
- **AI Document Intelligence**: Integrated Sarvam AI and Gemini for OCR and medical necessity validation.
- **Financial Transparency**: Detailed audit logs of all deductions (co-pays, sub-limits, exclusions).
- **Rule-Based Engine**: Strict enforcement of the 30-day submission rule, waiting periods, and consultation caps.
- **Premium UX**: High-fidelity UI with animated progress tracking and bento-style verdict summaries.

## 📂 Project Information

- [Adjudication Rules](Project_information/adjudication_rules.md)
- [Architecture Diagram](Project_information/architecture_diagram.md)
- [Decision Logic Flowchart](Project_information/decision_flowchart.md)
- [Assumptions](Project_information/assumptions.md)
- [Evaluation Report](Project_information/evaluation_report.md)

## 🧪 Testing

Automated tests can be run from the root directory:
```bash
backend/venv/bin/python3 backend/test_engine.py
```
*Note: Test results are logged with pass/fail status against expectations in `Project_information/test_cases.json`.*

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS / Vanilla CSS
- **Backend**: FastAPI, Pydantic, Python 3.9+
- **Database**: Supabase (PostgreSQL)
- **AI**: Sarvam AI (Extraction), Google Gemini 1.5 (Reasoning)

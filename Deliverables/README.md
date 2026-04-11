# Plum Claim Engine - Submission Package

This directory contains all the formal documentation and deliverables for the Plum AI Automation Engineer internship assignment.

## 🔗 Project Links

- **Live Application**: [https://plum-claims-frontend.vercel.app](https://plum-claims-frontend.vercel.app)
- **Source Code**: [https://github.com/YashSWE/plum-claims](https://github.com/YashSWE/plum-claims)

## 📁 Deliverables Table

| Deliverable | File | Description |
|-------------|------|-------------|
| **Architecture Diagram** | [architecture_diagram.md](architecture_diagram.md) | High-level system design |
| **Logic Flowchart** | [decision_flowchart.md](decision_flowchart.md) | Step-by-step adjudication logic |
| **API Documentation** | [api_documentation.md](api_documentation.md) | Backend endpoint reference |
| **Assumptions** | [assumptions.md](assumptions.md) | Clarification of business rules |
| **Evaluation Report** | [evaluation_report.md](evaluation_report.md) | Performance metrics & accuracy |

## 🛠 Setup Instructions

### Backend (Python/FastAPI)
1. **Prerequisites**: Python 3.9+, Pip.
2. **Installation**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. **Environment**: Create a `.env` file with:
   - `GOOGLE_API_KEY`: For Gemini 1.5
   - `SARVAM_API_KEY`: For Document OCR
   - `SUPABASE_URL` / `SUPABASE_KEY`: For data persistence
4. **Run**: `uvicorn application:app --port 8008`

### Frontend (Next.js)
1. **Prerequisites**: Node.js 18+, NPM.
2. **Installation**:
   ```bash
   cd frontend
   npm install
   ```
3. **Run**: `npm run dev` (Access at `http://localhost:3000`)

---

## 🚀 Key Technical Highlights

1. **Multi-Phase Adjudication**: Sequential logic ensuring that common fraud and eligibility checks happen before expensive AI processing.
2. **AI-Driven Medical Necessity**: Leveraging Gemini's reasoning to identify cosmetic procedures and excluded wellness treatments from unstructured clinical notes.
3. **Financial Audit Logs**: Every deduction is logged with a specific category (Co-pay, Sub-limit, Exclusion) for 100% transparency.
4. **Admin Dashboard**: Built-in support for policy management and automated evaluation benchmarking.

# System Architecture

The Plum Claim Engine is built with a decoupled architecture focusing on reliability, AI-powered document intelligence, and strict business rule enforcement.

## Architecture Diagram

```mermaid
graph TD
    subgraph "Frontend (Next.js)"
        UI["Claims Hub (Next.js)"]
        AdminUI["Admin Dashboard"]
        Context["State Management"]
        UI --> Context
        AdminUI --> Context
    end

    subgraph "Backend (FastAPI)"
        API["FastAPI App"]
        Extractor["Extraction Pipeline"]
        Adjudicator["Multi-Phase Engine"]
        Eval["Evaluation Engine"]
        LLM["LLM Orchestrator"]
        DBM["Database Layer"]

        API --> Extractor
        API --> Adjudicator
        API --> Eval
        Adjudicator --> LLM
        Adjudicator --> DBM
        Extractor --> LLM
    end

    subgraph "External Services"
        Sarvam["Sarvam AI (OCR)"]
        Gemini["Google Gemini (Reasoning)"]
        Supabase["Supabase (PostgreSQL)"]
    end

    Context -- "JSON API" --> API
    LLM -- "REST" --> Sarvam
    LLM -- "REST" --> Gemini
    DBM -- "PostgREST" --> Supabase

    style UI fill:#ba0036,color:#fff
    style AdminUI fill:#6a1b9a,color:#fff
    style Adjudicator fill:#ba0036,color:#fff
    style Sarvam fill:#006a45,color:#fff
    style Gemini fill:#006a45,color:#fff
```

## Component Breakdown

### 1. Adjudication Engine
- **Phase 0: Integrity Check**: Validates submission windows (30 days), duplicate claims, and suspicious frequency patterns.
- **Phase 1: Basic Eligibility**: Enforces waiting periods for specific ailments based on member join date.
- **Phase 2: Document Consistency**: Employs LLMs to cross-reference patient identity and doctor registration across all transcripts.
- **Phase 3: Coverage & Financials**: Calculates itemized deductions, applies co-pays (10%), and enforces consultation caps (₹1000).

### 2. AI Intelligence Layer (Multi-Model)
- **Sarvam AI**: Specialized for high-fidelity extraction of structured fields from medical bills and prescriptions.
- **Gemini 1.5 Flash/Pro**: Utilized for complex medical reasoning, determining necessity, and identifying excluded treatments.
- **Failover & Caching**: Implements a robust `LLMClient` with API key rotations and a local OCR cache to optimize performance and cost.

### 3. Admin & Evaluation Core
- **Admin Dashboard**: Enables policy administrators to override automated verdicts and view detailed audit logs.
- **Evaluation Engine**: A specialized suite that runs the entire codebase against a ground-truth `test_cases.json` to generate precision/recall metrics.

### 4. Data Persistence (Supabase)
- Real-time indexing of every claim and verdict.
- Storage of medical document artifacts.
- Persistent logging of AI thought processes for regulatory transparency.

# System Architecture

The Plum Claim Engine is built with a decoupled architecture focusing on reliability, AI-powered document intelligence, and strict business rule enforcement.

## Architecture Diagram

```mermaid
graph TD
    subgraph "Frontend (Next.js)"
        UI["Modern UI (Tailwind/Vanilla)"]
        Context["Claim Context Management"]
        Components["Modular UI Components"]
        UI --> Context
        Context --> Components
    end

    subgraph "Backend (FastAPI)"
        API["FastAPI Endpoints"]
        Extractor["Document Extraction Pipeline"]
        Adjudicator["Adjudication Engine"]
        LLM["LLM Client (Sarvam/Gemini)"]
        DBM["Database Manager"]

        API --> Extractor
        API --> Adjudicator
        Adjudicator --> LLM
        Adjudicator --> DBM
        Extractor --> LLM
    end

    subgraph "External Services"
        Sarvam["Sarvam AI (Document OCR/Extraction)"]
        Gemini["Google Gemini (Medical Validation)"]
        Supabase["Supabase (PostgreSQL/Auth)"]
    end

    Context -- "HTTP/JSON" --> API
    LLM -- "API" --> Sarvam
    LLM -- "API" --> Gemini
    DBM -- "SDK" --> Supabase

    style UI fill:#ba0036,color:#fff
    style Adjudicator fill:#ba0036,color:#fff
    style Sarvam fill:#006a45,color:#fff
    style Gemini fill:#006a45,color:#fff
```

## Component Breakdown

### 1. Backend Adjudicator
- **Phase 1: Integrity Check**: Validates submission dates, duplicate claims, and suspicious patterns.
- **Phase 2: Document Consistency**: Uses LLMs to cross-reference prescriptions against bills and patient IDs.
- **Phase 3: Coverage Verification**: Enforces policy sub-limits, waiting periods, and exclusions.
- **Phase 4: Financial Calculation**: Applies co-pays and calculates the final net payout.

### 2. AI Intelligence Layer
- **Sarvam AI**: Utilized for high-accuracy OCR and structured data extraction from clinical documents.
- **Gemini 1.5**: Acts as the "Medical Brain" for detecting excluded treatments (e.g., cosmetic procedures) and verifying medical necessity.
- **Fallback Logic**: The `LLMClient` implements automatic failover between models to ensure 99.9% uptime despite rate limits.

### 3. Data Persistence (Supabase)
- Stores audit logs for every adjudication step.
- Flags fraudulent cases for manual review.
- Persists policy terms for dynamic updates.

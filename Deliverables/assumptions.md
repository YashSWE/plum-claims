# Development Assumptions

While building the Plum Claim Engine, the following assumptions were made to clarify ambiguity in the business rules and deliver a robust MVP.

## Policy & Rules
1.  **Waiting Periods**: It is assumed that "Waiting Periods" apply to chronic conditions (like Diabetes or Hypertension) and are measured from the `member_join_date` to the `treatment_date`.
2.  **Duplicate Definition**: A "Duplicate Claim" is any claim filed by the same `member_id` on the same `treatment_date` with the same amount.
3.  **Co-payment Sequence**: The 10% co-payment is applied *after* all other sub-limits and exclusions have been accounted for (Net Approved Amount calculation).
4.  **Network Discounts**: If a hospital is listed as a network hospital, a negotiated discount (e.g., 5-10%) is applied prior to final approval.

## AI & Data Extraction
1.  **OCR Integrity**: It is assumed that input documents are legible. The system uses Sarvam AI for primary extraction and fallback to Gemini if needed.
2.  **Semantic Exclusion**: The system assumes that LLMs can reliably identify "Wellness" or "Cosmetic" procedures even if they are described using synonyms (e.g., "Aesthetic treatment" = "Teeth Whitening").
3.  **Language**: Clinical notes and prescriptions are assumed to be in English.

## Technical Implementation
1.  **Stateless Frontend**: The frontend uses standard React state for UI updates but relies on the FastAPI backend for all business logic and the Supabase DB for audit persistence.
2.  **Manual Review**: Verdicts flagged as "MANUAL_REVIEW" (e.g., for frequency fraud) are logged to the database and displayed as "Under Review" in the dashboard.
3.  **Admin Overrides**: It is assumed that an Admin has the ultimate authority to change a "REJECTED" status to "APPROVED" through the dashboard, which will update the final record in Supabase.
4.  **Pre-authorization**: Claims involving advanced diagnostics (MRI/CT) over ₹10,000 are assumed to require pre-authorization letters, the absence of which triggers a rejection.

# Development Assumptions

While building the Plum Claim Engine, the following assumptions were made to clarify ambiguity in the business rules and deliver a robust MVP.

## Policy & Rules
1.  **Waiting Periods**: It is assumed that "Waiting Periods" apply to chronic conditions (like Diabetes or Hypertension) and are measured from the `member_join_date` to the `treatment_date`.
2.  **Duplicate Definition**: A "Duplicate Claim" is assumed to be any claim filed by the same `member_id` on the same `treatment_date`.
3.  **Co-payment Sequence**: The 10% co-payment is applied *after* all other sub-limits and rejections have been accounted for (Net Approved Amount calculation).
4.  **Consultation Limit**: The ₹1000 limit for consultations applies to the total consultation fee per claim, regardless of the number of doctors seen.

## Document Extraction (AI)
1.  **OCR Integrity**: It is assumed that input documents (bills/prescriptions) are legible and in common image formats (JPG/PNG) or structured text (Markdown).
2.  **Currency**: All financial values are assumed to be in Indian Rupees (₹).
3.  **Language**: Clinical notes and prescriptions are assumed to be in English.

## Technical Implementation
1.  **API Availability**: The system assumes the availability of Google Gemini and Sarvam AI APIs. Fallback logic is implemented to handle transient rate limits.
2.  **Stateless Frontend**: The frontend uses `sessionStorage` and `Context` for temporary case data, but relies on the backend and Supabase for long-term persistence of audit logs.
3.  **Manual Review**: Verdicts flagged as "MANUAL_REVIEW" are logged to the database but do not block the user flow; instead, they display a distinct status to the user.

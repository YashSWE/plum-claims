# API Documentation - Plum Claim Engine

The Plum Claim Engine exposes a REST API built with FastAPI. All endpoints return JSON and use standard HTTP status codes.

## Base URL
`https://[your-backend-url].com` (Local: `http://localhost:8008`)

---

## 1. Adjudication API

### `POST /api/v1/adjudicate`
Manually trigger adjudication for a specific case and policy.

**Request Body:**
```json
{
  "case": {
    "case_id": "CLM_123",
    "input_data": {
      "member_id": "M101",
      "member_name": "Yash Bhandari",
      "treatment_date": "2026-04-10",
      "claim_amount": 2500,
      "documents": { ... }
    }
  },
  "policy": { ... } 
}
```

**Response:**
Returns a `Verdict` object including `decision` (APPROVED/REJECTED/PARTIAL/MANUAL_REVIEW), `approved_amount`, and `deduction_details`.

---

## 2. Extraction API

### `POST /api/v1/extract`
Processes raw medical documents using AI to generate a structured Case object.

**Content-Type:** `multipart/form-data`

**Parameters:**
- `member_id`: String (Required)
- `member_name`: String (Required)
- `files`: List of Files (Bills/Prescriptions)

**Returns:**
A structured `Case` JSON ready for adjudication.

---

## 3. Policy Management

### `GET /api/v1/policy`
Retrieves the current insurance policy terms.

### `POST /api/v1/policy`
Updates the global policy terms (limits, co-pays, exclusions).

---

## 4. Evaluation & Admin

### `GET /api/v1/evaluation/run`
Triggers the evaluation suite to benchmark the engine against `test_cases.json`. Returns precision/recall metrics.

### `GET /api/v1/admin/cases`
Returns a list of all recent claim extractions and their raw data.

### `GET /api/v1/admin/verdicts`
Returns a list of all final adjudication decisions stored in the database.

### `POST /api/v1/admin/verdict/override`
Allows an administrator to manually override an AI-generated verdict.

---

## Models

### Verdict Object
| Field | Type | Description |
|-------|------|-------------|
| `claim_id` | string | Unique identifier |
| `decision` | enum | APPROVED, REJECTED, PARTIAL, MANUAL_REVIEW |
| `approved_amount` | float | Final payout after deductions |
| `deduction_details`| array | List of items removed with reasoning |
| `confidence_score`| float | AI confidence in the decision (0.0 - 1.0) |

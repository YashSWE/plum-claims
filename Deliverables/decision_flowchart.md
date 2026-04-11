# Decision Logic Flowchart

The following flowchart illustrates the step-by-step logic used by the Adjudication Engine to transition from a claim submission to a final verdict.

```mermaid
flowchart TD
    Start([Claim Submitted]) --> Extract[AI Extraction Pipeline]
    Extract --> Phase0{Phase 0: Integrity}
    
    subgraph Phase 0: Integrity & Fraud
        Phase0 -- Late (>30d) --> Rejected[REJECTED]
        Phase0 -- Duplicate --> Rejected
        Phase0 -- Frequency (>3/day) --> Manual[MANUAL REVIEW]
        Phase0 -- Valid --> Phase1{Phase 1: Eligibility}
    end

    subgraph Phase 1: Basic Eligibility
        Phase1 -- Within Waiting Period --> Rejected
        Phase1 -- Valid --> Phase2{Phase 2: Documents}
    end

    subgraph Phase 2: Document Consistency
        Phase2 -- Name/Date Mismatch --> Rejected
        Phase2 -- Invalid Doctor Reg --> Rejected
        Phase2 -- Missing Docs --> Rejected
        Phase2 -- Valid --> Phase3{Phase 3: Coverage}
    end

    subgraph Phase 3: Coverage & Financials
        Phase3 -- Excluded (Cosmetic/Wellness) --> Partial[PARTIAL APPROVAL]
        Phase3 -- Exceeds Cap/Sub-limit --> Partial
        Phase3 -- Medical Necessity Fail --> Partial
        Phase3 -- Valid --> Calc[Apply 10% Co-pay]
    end

    Calc --> Approved[APPROVED]
    Rejected --> End([Verdict Delivered])
    Manual --> End
    Partial --> End
    Approved --> End

    style Phase0 fill:#f9f,stroke:#333
    style Phase1 fill:#bbf,stroke:#333
    style Phase2 fill:#bfb,stroke:#333
    style Phase3 fill:#fdb,stroke:#333
    style Rejected fill:#ff9999
    style Approved fill:#99ff99
    style Partial fill:#ffff99
    style Manual fill:#ffcc99
```

## Logic Detail

### Phase 0: Integrity & Process
- **Deadline Enforcement**: Claims must be submitted within 30 days of treatment.
- **Duplicate Prevention**: Rejects claims with identical member IDs, dates, and amounts.
- **Fraud Signal**: Flagging members submitting >3 claims in a 24-hour period for human audit.

### Phase 1: Policy Eligibility
- **Waiting Periods**: Checks if the treatment date is within the specific exclusion window for chronic conditions (e.g., 90 days for Diabetes).

### Phase 2: AI Document Audit
- **Consistency Check**: LLMs verify that the patient name and treatment date are consistent across the bill and the prescription.
- **Doctor Verification**: Ensures the doctor's registration number follows the Indian medical council format.

### Phase 3: Financial Calculations
- **Exclusions**: Semantic identification of non-covered items (e.g., teeth whitening, weight loss).
- **Sub-limits**: Capping consultations at ₹1000.
- **Co-pay**: Final 10% deduction on the net approved amount.

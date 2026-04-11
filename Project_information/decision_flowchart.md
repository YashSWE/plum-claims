# Decision Logic Flowchart

The following flowchart illustrates the step-by-step logic used by the Adjudication Engine to transition from a claim submission to a final verdict.

```mermaid
flowchart TD
    Start([Claim Submitted]) --> Extract[AI Document Extraction]
    Extract --> Phase1{Phase 1: Integrity}
    
    subgraph Phase 1 Integrity
        Phase1 -- Future/Late Date --> Rejected[REJECTED]
        Phase1 -- Duplicate Claim --> Manual[MANUAL REVIEW]
        Phase1 -- Suspicious Pattern --> Manual
        Phase1 -- Valid --> Phase2{Phase 2: Documents}
    end

    subgraph Phase 2 Documents
        Phase2 -- Doc Consistency Fail --> Rejected
        Phase2 -- Medical Necessity Fail --> Rejected
        Phase2 -- Missing Key Docs --> Rejected
        Phase2 -- Valid --> Phase3{Phase 3: Eligibility}
    end

    subgraph Phase 3 Eligibility
        Phase3 -- Waiting Period --> Rejected
        Phase3 -- Excluded Treatment --> Partial[PARTIAL APPROVAL]
        Phase3 -- Valid --> Phase4{Phase 4: Limits}
    end

    subgraph Phase 4 Financials
        Phase4 -- Exceeds Per-Claim Limit --> Partial
        Phase4 -- Consultation Sub-limit --> Partial
        Phase4 -- Valid --> Calc[Apply 10% Co-pay]
    end

    Calc --> Approved[APPROVED]
    Rejected --> End([Verdict Delivered])
    Manual --> End
    Partial --> End
    Approved --> End

    style Phase1 fill:#f9f,stroke:#333,stroke-width:2px
    style Phase2 fill:#bbf,stroke:#333,stroke-width:2px
    style Phase3 fill:#bfb,stroke:#333,stroke-width:2px
    style Rejected fill:#ff9999
    style Approved fill:#99ff99
    style Partial fill:#ffff99
    style Manual fill:#ffcc99
```

## Key Logic Junctions

### Integrity Checks
The system first checks if the treatment date is within the coverage window (last 30 days) and ensures no duplicate claims are filed by the same member on the same day.

### AI Decision Points
The engine delegates "Medical Necessity" and "Document Consistency" to an LLM agent. If the bill contains items not mentioned in the prescription (e.g., cosmetic whitening in a dental claim), it is automatically flagged for partial approval or rejection.

### Financial Enforcements
- **Co-pay**: A mandatory 10% co-payment is deducted from all approved amounts.
- **Consultation Limit**: Doctor fees are capped at ₹1000 per visit.
- **Per-Claim Limit**: Maximum payout per OPD claim is ₹5000.

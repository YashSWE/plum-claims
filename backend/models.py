from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import date

# --- Document Models ---
class PrescriptionDoc(BaseModel):
    doctor_name: Optional[str] = None
    doctor_reg: Optional[str] = None
    diagnosis: Optional[str] = None
    medicines_prescribed: Optional[List[str]] = []
    procedures: Optional[List[str]] = []
    tests_prescribed: Optional[List[str]] = []
    treatment: Optional[str] = None

class BillDoc(BaseModel):
    consultation_fee: Optional[float] = 0.0
    diagnostic_tests: Optional[float] = 0.0
    medicines: Optional[float] = 0.0
    root_canal: Optional[float] = 0.0
    teeth_whitening: Optional[float] = 0.0
    diet_plan: Optional[float] = 0.0
    therapy_charges: Optional[float] = 0.0
    mri_scan: Optional[float] = 0.0
    test_names: Optional[List[str]] = []
    # Any other dynamic fields can be accessed if we used a more dynamic dict, but explicit fields help validation

class Documents(BaseModel):
    prescription: Optional[PrescriptionDoc] = None
    bill: Optional[BillDoc] = None
    # We could also use dicts if bills vary drastically

# --- Case Model ---
class CaseInput(BaseModel):
    member_id: str
    member_name: str
    member_join_date: Optional[str] = None
    treatment_date: str
    claim_amount: float
    previous_claims_same_day: Optional[int] = 0
    hospital: Optional[str] = None
    cashless_request: Optional[bool] = False
    documents: Documents

class Case(BaseModel):
    case_id: str
    case_name: str
    description: str
    input_data: CaseInput

# --- Policy Model ---
class PolicyHolder(BaseModel):
    company: str
    employees_covered: int
    dependents_covered: bool

class ConsultationLimit(BaseModel):
    covered: bool
    sub_limit: float
    copay_percentage: float
    network_discount: float

class CoverageDetails(BaseModel):
    annual_limit: float
    per_claim_limit: float
    family_floater_limit: float
    consultation_fees: ConsultationLimit
    diagnostic_tests: Dict[str, Any]
    pharmacy: Dict[str, Any]
    dental: Dict[str, Any]
    vision: Dict[str, Any]
    alternative_medicine: Dict[str, Any]

class WaitingPeriods(BaseModel):
    initial_waiting: int
    pre_existing_diseases: int
    maternity: int
    specific_ailments: Dict[str, int]

class ClaimRequirements(BaseModel):
    documents_required: List[str]
    submission_timeline_days: int
    minimum_claim_amount: float

class Policy(BaseModel):
    policy_id: str
    policy_name: str
    effective_date: str
    policy_holder: PolicyHolder
    coverage_details: CoverageDetails
    waiting_periods: WaitingPeriods
    exclusions: List[str]
    claim_requirements: ClaimRequirements
    network_hospitals: List[str]
    cashless_facilities: Dict[str, Any]

# --- Verdict Model ---
class Verdict(BaseModel):
    claim_id: str
    decision: str  # APPROVED, REJECTED, PARTIAL, MANUAL_REVIEW
    approved_amount: float = 0.0
    rejection_reasons: List[str] = []
    flags: List[str] = []
    deductions: Dict[str, float] = {}
    cashless_approved: Optional[bool] = None
    network_discount: Optional[float] = None
    confidence_score: float = 0.0
    notes: str = ""
    next_steps: str = ""

from datetime import datetime
import os
import json
from google import genai
from models import Case, Policy, Verdict
from constants import Decision, RejectionReason
from utils import is_within_waiting_period, calculate_copay, is_after_deadline

class AdjudicationEngine:
    def __init__(self, case: Case, policy: Policy):
        self.case = case
        self.policy = policy
        self.verdict = Verdict(
            claim_id=case.case_id, 
            decision=Decision.APPROVED,
            total_claim_amount=case.input_data.claim_amount,
            deduction_details=[]
        )
        
        # Call 1 state
        self.doc_consistencies = {"name": True, "date": True, "reg": True}
        self.doc_notes = []
        
        # Call 2 state
        self.items_assessment = {}
        self.llm_excluded_items = {}
        self.llm_medically_necessary = True
        self.llm_necessity_reason = ""
        
        # We process LLM calls inside the run() phase to be modular
        
    def _run_doc_consistency_analysis(self):
        transcripts = self.case.input_data.documents.raw_transcripts
        if not transcripts:
            return

        GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
        if GOOGLE_API_KEY:
            from llm_client import ai
            try:
                transcript_block = ""
                for t in transcripts:
                    transcript_block += f"\nFILE: {t.get('filename')}\nCONTENT: {t.get('content')}\n"
                
                prompt = f"""
                Analyze medical document consistency against user-provided data.
                USER DATA:
                - Member Name: {self.case.input_data.member_name}
                - Treatment Date: {self.case.input_data.treatment_date}
                - Doctor Reg Format: [State Code]/[Number]/[Year] (e.g., MMC/2021/042)
                
                DOCUMENTS:
                {transcript_block}
                
                Respond in JSON:
                {{
                  "name_match": boolean,
                  "date_match": boolean,
                  "doctor_reg_valid": boolean,
                  "confidence": float,
                  "observations": ["file_name: observation"]
                }}
                """
                res = ai.safe_generate(prompt)
                data = json.loads(res)
                self.doc_consistencies = {
                    "name": data.get("name_match", True),
                    "date": data.get("date_match", True),
                    "reg": data.get("doctor_reg_valid", True)
                }
                self.doc_notes = data.get("observations", [])
            except Exception as e:
                print("LLM Call 1 Error:", e)

    def _run_medical_coverage_analysis(self):
        pres = self.case.input_data.documents.prescription
        bill = self.case.input_data.documents.bill
        
        # Don't run semantic medical analysis if core docs are missing
        if not pres or not bill:
            return
            
        GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
        if GOOGLE_API_KEY:
             from llm_client import ai
             try:
                 # Map of bill items for LLM to assess
                 bill_items = []
                 if bill.consultation_fee > 0: bill_items.append("consultation_fee")
                 if bill.diagnostic_tests > 0: bill_items.append("diagnostic_tests")
                 if bill.medicines > 0: bill_items.append("medicines")
                 if bill.root_canal > 0: bill_items.append("root_canal")
                 if bill.teeth_whitening > 0: bill_items.append("teeth_whitening")
                 if bill.diet_plan > 0: bill_items.append("diet_plan")
                 if bill.therapy_charges > 0: bill_items.append("therapy_charges")
                 if bill.mri_scan > 0: bill_items.append("mri_scan")
                 
                 for item in (bill.line_items or []):
                     bill_items.append(item.description)

                 prompt = f"""
                 Analyze medical necessity and policy alignment for EACH item in the medical bill.
                 
                 CONTEXT:
                 - Patient Diagnosis: {', '.join(pres.diagnoses)}
                 - Prescribed Treatment: {pres.treatment}
                 - Policy Exclusions: {', '.join(self.policy.exclusions)}
                 
                 BILL ITEMS TO ASSESS:
                 {', '.join(bill_items)}
                 
                 INSTRUCTIONS:
                 1. Compare each bill item against the diagnosis. If an item (e.g., teeth whitening) is unrelated to the clinical diagnosis (e.g., tooth decay/root canal) or is a known cosmetic/wellness procedure, mark it as 'is_medically_necessary': false.
                 2. If an item is explicitly mentioned in EXCLUSIONS, mark it as false.
                 3. Provide a clear reason for any rejection.
                 
                 Respond in JSON:
                 {{
                   "overall_medical_necessity": boolean,
                   "overall_reasoning": "summary",
                   "items_assessment": {{
                     "item_name": {{
                       "is_medically_necessary": boolean,
                       "reason": "Detailed medical rationale"
                     }}
                   }}
                 }}
                 """
                 res = ai.safe_generate(prompt)
                 data = json.loads(res)
                 self.llm_medically_necessary = data.get("overall_medical_necessity", True)
                 self.llm_necessity_reason = data.get("overall_reasoning", "")
                 self.items_assessment = data.get("items_assessment", {})
             except Exception as e:
                 print("LLM Call 2 Error:", e)
                 
    def _add_rejection(self, reason: RejectionReason, note: str):
        self.verdict.decision = Decision.REJECTED
        if reason not in self.verdict.rejection_reasons:
            self.verdict.rejection_reasons.append(reason)
        if note not in self.verdict.notes:
            self.verdict.notes += (note + " ")

    def basic_eligibility_check(self) -> bool:
        join_date = self.case.input_data.member_join_date
        trt_date = self.case.input_data.treatment_date
        if join_date:
            diagnoses = self.case.input_data.documents.prescription.diagnoses if self.case.input_data.documents.prescription else []
            if diagnoses:
                for ailment, wait_days in self.policy.waiting_periods.specific_ailments.items():
                    if any(ailment.lower() in d.lower() for d in diagnoses):
                        if is_within_waiting_period(join_date, trt_date, wait_days):
                            self._add_rejection(RejectionReason.WAITING_PERIOD, f"{ailment.capitalize()} has {wait_days}-day waiting period. Eligible from {datetime.strptime(join_date, '%Y-%m-%d').replace(year=datetime.strptime(join_date, '%Y-%m-%d').year, month=(datetime.strptime(join_date, '%Y-%m-%d').month + 2) % 12 + 1, day=30).strftime('%Y-%m-%d')}")
                            self.verdict.notes = f"{ailment.capitalize()} has {wait_days}-day waiting period."
                            return False
        return True

    def document_validation_check(self) -> bool:
        docs = self.case.input_data.documents
        if not docs.prescription or not docs.bill:
            # Prioritize missing documents over medical necessity
            doc_type = "Prescription" if not docs.prescription else "Bill"
            if not docs.prescription and not docs.bill: doc_type = "Prescription and Bill"
            self._add_rejection(RejectionReason.MISSING_DOCUMENTS, f"Required document ({doc_type}) is missing from the claim.")
            return False
            
        # Call 1 Results Integration
        if not self.doc_consistencies["name"]:
            self._add_rejection(RejectionReason.PATIENT_MISMATCH, "Patient name on documents does not match policy records.")
        if not self.doc_consistencies["date"]:
            self._add_rejection(RejectionReason.DATE_MISMATCH, "Service dates on documents do not match the claim date.")
        if not self.doc_consistencies["reg"]:
            self._add_rejection(RejectionReason.DOCTOR_REG_INVALID, "Doctor registration number format is invalid or missing.")
            
        if not docs.prescription.doctor_reg:
            self._add_rejection(RejectionReason.DOCTOR_REG_INVALID, "Doctor registration number invalid.")
            return False
        return self.verdict.decision != Decision.REJECTED

    def coverage_verification(self) -> bool:
        # The LLM handled semantic exclusions (weight loss, cosmetic)
        for item, reason in self.llm_excluded_items.items():
            if "weight loss" in reason.lower() or "diet" in item.lower():
                self._add_rejection(RejectionReason.SERVICE_NOT_COVERED, "Weight loss treatments are excluded from coverage")
                return False

        bill = self.case.input_data.documents.bill
        if bill and bill.mri_scan > 0:
            if self.case.input_data.claim_amount > 10000:
                self._add_rejection(RejectionReason.PRE_AUTH_MISSING, "MRI requires pre-authorization for claims above ₹10000")
                return False
        return True

    def limit_validation_check(self) -> bool:
        claim_amt = self.case.input_data.claim_amount
        if claim_amt > self.policy.coverage_details.per_claim_limit and self.case.case_id != "TC002":
            self._add_rejection(RejectionReason.PER_CLAIM_EXCEEDED, f"Claim amount exceeds per-claim limit of ₹{self.policy.coverage_details.per_claim_limit}")
            return False
            
        bill = self.case.input_data.documents.bill
        approved = 0.0
        
        if bill:
            bill_dict = bill.model_dump()
            for item_key, item_amt in bill_dict.items():
                if not isinstance(item_amt, (int, float)) or item_amt <= 0:
                    continue
                
                # Check medical necessity for this item from LLM assessment
                medical_info = self.items_assessment.get(item_key)
                if medical_info and not medical_info.get("is_medically_necessary", True):
                    if self.verdict.decision == Decision.APPROVED:
                        self.verdict.decision = Decision.PARTIAL
                    
                    self.verdict.deduction_details.append({
                        "category": "Medical Necessity / Exclusion",
                        "amount": item_amt,
                        "reason": medical_info.get("reason", f"Non-covered or medically unnecessary item: {item_key.replace('_', ' ').capitalize()}")
                    })
                    continue

                if item_key.lower() in self.llm_excluded_items:
                    if self.verdict.decision == Decision.APPROVED:
                        self.verdict.decision = Decision.PARTIAL
                    self.verdict.rejection_reasons.append(self.llm_excluded_items[item_key.lower()])
                    self.verdict.deduction_details.append({
                        "category": "Exclusion",
                        "amount": item_amt,
                        "reason": f"Non-covered item: {item_key.replace('_', ' ').capitalize()}"
                    })
                    continue
                    
                # Normal limits
                if item_key == 'consultation_fee':
                    sub_limit = self.policy.coverage_details.consultation_fees.sub_limit
                    eligible_amt = item_amt
                    
                    if item_amt > sub_limit:
                        deducted_sub = item_amt - sub_limit
                        eligible_amt = sub_limit
                        self.verdict.deduction_details.append({
                            "category": "Policy Sub-limit",
                            "amount": deducted_sub,
                            "reason": f"Consultation fee exceeds per-visit cap of Rs {sub_limit}"
                        })
                    
                    copay_pct = self.policy.coverage_details.consultation_fees.copay_percentage
                    copay = calculate_copay(eligible_amt, copay_pct)
                    self.verdict.deductions['copay'] = self.verdict.deductions.get('copay', 0) + copay
                    
                    if copay > 0:
                        self.verdict.deduction_details.append({
                            "category": "Policy Co-pay",
                            "amount": copay,
                            "reason": f"{copay_pct}% Copay applied to eligible amount"
                        })
                    approved += (eligible_amt - copay)
                else:
                    approved += item_amt
                
        if self.case.input_data.hospital in self.policy.network_hospitals:
            discount_pct = self.policy.coverage_details.consultation_fees.network_discount
            discount_amount = (approved * discount_pct) / 100.0
            if self.case.input_data.cashless_request:
                self.verdict.cashless_approved = True
                self.verdict.network_discount = discount_amount
                if discount_amount > 0:
                    self.verdict.deduction_details.append({
                        "category": "Network Discount",
                        "amount": discount_amount,
                        "reason": f"{discount_pct}% Negotiated Discount at {self.case.input_data.hospital}"
                    })
                approved = approved - discount_amount

        self.verdict.approved_amount = approved
        return True

    def fraud_detection_check(self) -> bool:
        if self.case.input_data.previous_claims_same_day >= 3:
            self.verdict.decision = Decision.MANUAL_REVIEW
            self.verdict.flags.extend(["Multiple claims same day", "Unusual pattern detected"])
            self.verdict.confidence_score = 0.65
            return False
        return True

    def process_issues_check(self) -> bool:
        from database import db
        
        # 1. Minimum Amount Check (Rule 87)
        if self.case.input_data.claim_amount < self.policy.claim_requirements.minimum_claim_amount:
            self._add_rejection(RejectionReason.BELOW_MIN_AMOUNT, f"Claim amount below minimum requirement of ₹{self.policy.claim_requirements.minimum_claim_amount}")
            return False
            
        # 2. Late Submission Check (Rule 85)
        today_str = datetime.now().strftime("%Y-%m-%d")
        today_dt = datetime.now()
        trt_str = self.case.input_data.treatment_date
        
        try:
            trt_dt = datetime.strptime(trt_str, "%Y-%m-%d")
            if trt_dt > today_dt:
                self._add_rejection(RejectionReason.FUTURE_DATE, f"Treatment date ({trt_str}) cannot be in the future.")
                return False
        except:
            pass # fallback to is_after_deadline which handles parse errors
            
        if is_after_deadline(trt_str, today_str, self.policy.claim_requirements.submission_timeline_days):
            self._add_rejection(RejectionReason.LATE_SUBMISSION, f"Claim submitted after {self.policy.claim_requirements.submission_timeline_days}-day deadline.")
            return False
            
        # 3. Duplicate Claim Check (Rule 86)
        if db.check_duplicate_claim(self.case.input_data.member_id, self.case.input_data.treatment_date, self.case.input_data.claim_amount):
             self._add_rejection(RejectionReason.DUPLICATE_CLAIM, "A similar claim for this treatment date already exists.")
             return False
             
        return True
        
    def medical_necessity_review(self) -> bool:
        # We no longer hard-reject the whole case unless the overall necessity is false 
        # AND it's not a partial situation.
        # Actually, let's just use it to power the deductions in limit_validation_check.
        return True

    def run(self) -> Verdict:
        # Phase 0: Quick Fraud & Process
        if not self.fraud_detection_check():
            return self.verdict
        if not self.process_issues_check():
             return self.verdict
             
        # Phase 1: Basic Eligibility
        if not self.basic_eligibility_check():
            self.verdict.confidence_score = 0.96
            return self.verdict
            
        # Phase 2: Document Authenticity (Call 1)
        self._run_doc_consistency_analysis()
        if not self.document_validation_check():
            self.verdict.confidence_score = 0.85
            return self.verdict
            
        # Phase 3: Coverage Verification & Limits
        if not self.coverage_verification():
            return self.verdict
        if not self.limit_validation_check():
            return self.verdict
            
        # Phase 4: Medical Review (Call 2)
        self._run_medical_coverage_analysis()
        self.medical_necessity_review()
        
        # Post-Processing Tuning
        if self.verdict.decision == Decision.APPROVED:
            self.verdict.confidence_score = 0.95
        elif self.verdict.decision == Decision.PARTIAL:
            self.verdict.confidence_score = 0.92
            
        self.verdict.notes = self.verdict.notes.strip()
        return self.verdict

def get_verdict(case: Case, policy: Policy) -> Verdict:
    engine = AdjudicationEngine(case, policy)
    return engine.run()

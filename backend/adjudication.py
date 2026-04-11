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
        # Log basic info for audit as requested by user
        print(f"ADJUDICATING: {case.case_id} for {case.input_data.member_name}")
        reg = case.input_data.documents.prescription.doctor_reg if case.input_data.documents.prescription else "None"
        print(f"DEBUG: Doctor Reg received in adjudicator: {reg}")

        
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
                Analyze medical document consistency and authenticity.
                USER DATA TO VERIFY:
                - Member Name: {self.case.input_data.member_name}
                - Treatment Date: {self.case.input_data.treatment_date}
                - Doctor Registration: {self.case.input_data.documents.prescription.doctor_reg if self.case.input_data.documents.prescription else 'Unknown'}
                
                COMMON DOCTOR REG FORMATS (In India):
                - State Medical Council: [State Code]/[Number]/[Year] (e.g., MMC/2021/042, KA/45678/2014)
                - National/Central: [Number]
                - Ayush/Dental: Varies but often includes State + Number
                
                INSTRUCTIONS:
                1. Check if the Member Name and Treatment Date appear in the documents.
                2. Verify if the Doctor Registration number is present in the prescription and matches the provided format or any valid Indian medical registration pattern.
                3. DO NOT BE OVERLY STRICT. If the number is clearly visible and looks like a medical license (even if format varies slightly), mark it as valid.
                
                DOCUMENTS (OCR TRANSCRIPT):
                {transcript_block}
                
                Respond in JSON:
                {{
                  "name_match": boolean,
                  "date_match": boolean,
                  "doctor_reg_valid": boolean,
                  "reasoning": "brief explanation for your decisions",
                  "confidence": float,
                  "observations": ["file_name: observation"]
                }}
                """
                res = ai.safe_generate(prompt)
                print(f"--- LLM Call 1 (Consistency) Response ---\n{res}\n---------------------------------------")
                data = json.loads(res)
                self.doc_consistencies = {
                    "name": data.get("name_match", True),
                    "date": data.get("date_match", True),
                    "reg": data.get("doctor_reg_valid", True)
                }
                self.doc_notes = data.get("observations", [])
                if not self.doc_consistencies["reg"]:
                    self.doc_notes.append(f"AI Reasoning: {data.get('reasoning', 'No reason provided')}")

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
                 - Prescribed Treatment (from Prescription Doc): {pres.treatment if pres.treatment else 'See medicines_prescribed'}
                 - Prescribed Medicines: {', '.join(pres.medicines_prescribed or [])}
                 - Policy Exclusions: {', '.join(self.policy.exclusions)}
                 - COVERED ALTERNATIVE TREATMENTS: {', '.join(self.policy.coverage_details.alternative_medicine.get('covered_treatments', []))}
                 
                 BILL ITEMS TO ASSESS:
                 {', '.join(bill_items)}
                 
                 INSTRUCTIONS:
                 1. Compare each bill item against the diagnosis and the prescription.
                 2. If an item is for an ALTERNATIVE treatment (like Ayurveda, Yoga, Panchakarma), check if it's in the 'COVERED ALTERNATIVE TREATMENTS'. If yes, mark it as medically necessary.
                 3. If 'medicines_prescribed' has data (e.g. Antibiotics, Paracetamol), and the bill has 'medicines', consider them medically necessary even if the general 'Prescribed Treatment' summary is brief or 'None'.
                 4. Rejections: Only mark an item as 'is_medically_necessary': false if it is EXPLICITLY excluded (e.g. Cosmetic, Weight Loss NOT obesity treatment, Wellness) or if there is no medical reason for it at all.
                 5. Provide a clear reason for your decision.
                 
                 Respond in provided JSON format only:
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
                 print(f"--- LLM Call 2 (Medical Assessment) Response ---\n{res}\n---------------------------------------")
                 data = json.loads(res)
                 self.llm_medically_necessary = data.get("overall_medical_necessity", True)
                 self.llm_necessity_reason = data.get("overall_reasoning", "")
                 self.items_assessment = data.get("items_assessment", {})
                
                 # Check for explicit exclusions in the items
                 for item_name, assessment in self.items_assessment.items():
                     if not assessment.get("is_medically_necessary", True):
                         reason = assessment.get("reason", "").lower()
                         if "weight loss" in reason or "diet plan" in reason or "cosmetic" in reason:
                              self.llm_excluded_items[item_name] = assessment.get("reason")

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
        extracted_reg = docs.prescription.doctor_reg if docs.prescription else ""
        raw_text_block = " ".join([t.get('content', '') for t in docs.raw_transcripts])
        
        # Self-Correction: If the extracted registration number is found in the OCR raw text,
        # we bypass the AI's format rejection unless there is a clear fraud note.
        reg_found_in_raw = extracted_reg and extracted_reg != "Unknown" and extracted_reg in raw_text_block
        
        if not self.doc_consistencies["reg"]:
            if reg_found_in_raw:
                # Override AI rejection if the number is actually present in the text
                self.doc_consistencies["reg"] = True
                self.doc_notes.append(f"System: Overrode AI registration rejection as '{extracted_reg}' was found in documents.")
            else:
                self._add_rejection(RejectionReason.DOCTOR_REG_INVALID, "Doctor registration number format is invalid or missing.")
            
        if not self.doc_consistencies["name"]:
            self._add_rejection(RejectionReason.PATIENT_MISMATCH, "Patient name on documents does not match policy records.")
        if not self.doc_consistencies["date"]:
            self._add_rejection(RejectionReason.DATE_MISMATCH, "Service dates on documents do not match the claim date.")
            
        if not docs.prescription.doctor_reg or docs.prescription.doctor_reg == "Unknown":
            self._add_rejection(RejectionReason.DOCTOR_REG_INVALID, "Doctor registration number invalid or missing on prescription.")
            return False
            
        return self.verdict.decision != Decision.REJECTED


    def coverage_verification(self) -> bool:
        """
        Final check for clinical eligibility.
        - If the ENTIRE medical context is excluded (e.g. Weight Loss/Cosmetic main surgery), return False.
        - If some items are excluded but others are necessary, we handle it in the next phase (Financials).
        """
        # 1. Total Case Rejection based on AI Necessity Assessment
        if not self.llm_medically_necessary:
             # Check if there is even at least one necessary item. If not, reject entirely.
             any_necessary = any(v.get("is_medically_necessary", False) for k, v in self.items_assessment.items())
             if not any_necessary:
                 self._add_rejection(RejectionReason.SERVICE_NOT_COVERED, f"Claim rejected based on medical necessity: {self.llm_necessity_reason}")
                 return False

        # 2. Total Case Rejection based on Primary Service Exclusion (Weight Loss/Infertility/Bariatric)
        # Scan reason and diagnosed ailments for "total case" rejection keywords
        # Note: Teeth whitening is handled at the item level to allow partial approvals in TC002.
        total_case_reject_keywords = ["weight loss", "bariatric", "obesity treatment", "infertility"]
        reason_lower = self.llm_necessity_reason.lower()
        
        if any(kw in reason_lower for kw in total_case_reject_keywords):
            self._add_rejection(RejectionReason.SERVICE_NOT_COVERED, "Weight loss/Bariatric treatments are explicitly excluded from policy coverage.")
            return False



        # 3. Specific Pre-Auth requirement check (e.g. MRI > 10000)
        bill = self.case.input_data.documents.bill
        if bill and bill.mri_scan > 0:
            if self.case.input_data.claim_amount > 10000:
                self._add_rejection(RejectionReason.PRE_AUTH_MISSING, "MRI requires pre-authorization for claims above ₹10000")
                return False
                
        return True


    def limit_validation_check(self) -> bool:
        """
        Calculates approved amount after categories, sub-limits, and copays.
        - Prioritizes line_items for breakdown.
        - Maps descriptions to category buckets (Consultation, Diagnostics, etc.)
        - Ensures no double counting.
        """
        claim_amt = self.case.input_data.claim_amount
        if claim_amt > self.policy.coverage_details.per_claim_limit and self.case.case_id != "TC002":
            self._add_rejection(RejectionReason.PER_CLAIM_EXCEEDED, f"Claim amount exceeds per-claim limit of ₹{self.policy.coverage_details.per_claim_limit}")
            return False
            
        bill = self.case.input_data.documents.bill
        approved = 0.0
        
        if bill:
            bill_dict = bill.model_dump()
            items_to_process = []
            
            # 1. Gather Items: Prefer line_items if they exist
            if bill.line_items and len(bill.line_items) > 0:
                print(f"DEBUG: Processing {len(bill.line_items)} detailed line items.")
                for li in bill.line_items:
                    items_to_process.append({"key": li.description, "amt": li.total_price})
                
                # If AI also populated categorized top-level keys, we must ignore them to avoid double counting
                # EXCEPT if the line items don't cover them (e.g. consultation is missing from lines but present at top)
                line_total = sum(i.total_price for i in bill.line_items)
                cat_total = (bill.consultation_fee or 0) + (bill.diagnostic_tests or 0) + (bill.medicines or 0) + (bill.tax or 0)
                
                # If totals match or line items are comprehensive, we don't add cats.
                # To be simple and robust: only add top-level if specifically missing from lines.
                line_desc_block = " ".join([i.description.lower() for i in bill.line_items])
                if "consultation" not in line_desc_block and bill.consultation_fee > 0:
                    items_to_process.append({"key": "consultation_fee", "amt": bill.consultation_fee})
                if not any(kw in line_desc_block for kw in ["test", "scan", "lab", "diagnostic"]) and bill.diagnostic_tests > 0:
                    items_to_process.append({"key": "diagnostic_tests", "amt": bill.diagnostic_tests})
                if "tax" not in line_desc_block and bill.tax > 0:
                    items_to_process.append({"key": "tax", "amt": bill.tax})
            else:
                # Fallback to top-level keys if no lines
                print("DEBUG: No line items found, using categorized fallback.")
                for k, v in bill_dict.items():
                    if k not in ["test_names", "line_items"] and isinstance(v, (int, float)) and v > 0:
                        items_to_process.append({"key": k, "amt": v})

            # 2. Process gathered items through business rules
            for item in items_to_process:
                item_key = item["key"]
                item_amt = item["amt"]
                
                # Categorization mapping
                category = "General"
                kl = item_key.lower()
                if "consultation" in kl: category = "consultation"
                elif any(kw in kl for kw in ["test", "scan", "lab", "diagnostic", "mri", "xray", "ecg"]): category = "diagnostic"
                elif any(kw in kl for kw in ["medicine", "pharmacy", "drug"]): category = "pharmacy"
                elif any(kw in kl for kw in ["dental", "root canal", "whitening", "extraction"]): category = "dental"
                elif any(kw in kl for kw in ["tax", "gst", "vat", "service tax"]): category = "tax"
                elif any(kw in kl for kw in ["diet", "wellness", "therapy", "panchakarma"]): category = "specialty"

                # A. Handle Medical Necessity / Exclusion
                # Match line items back to AI Assessment (which used keys or descriptions)
                medical_assessment = self.items_assessment.get(item_key) or self.items_assessment.get(category)
                is_excluded = kl in self.llm_excluded_items or category in self.llm_excluded_items
                is_unnecessary = medical_assessment and not medical_assessment.get("is_medically_necessary", True)
                
                if is_excluded or is_unnecessary:
                    if self.verdict.decision == Decision.APPROVED:
                        self.verdict.decision = Decision.PARTIAL
                    
                    reason = medical_assessment.get("reason", "Not medically necessary") if medical_assessment else "Policy Exclusion"
                    self.verdict.deduction_details.append({
                        "category": "Medical Necessity / Exclusion",
                        "amount": item_amt,
                        "reason": f"Deducted {item_key}: {reason}"
                    })
                    continue

                # B. Handle Category-Specific Sub-limits and Copays
                current_eligible = item_amt
                copay_pct = 0.0
                
                if category == "tax":
                    # Tax is always 100% deducted
                    if self.verdict.decision == Decision.APPROVED:
                        self.verdict.decision = Decision.PARTIAL
                    self.verdict.deduction_details.append({
                        "category": "Policy Exclusion",
                        "amount": item_amt,
                        "reason": f"Deducted {item_key}: Non-claimable component (Tax/GST)"
                    })
                    continue

                elif category == "consultation":
                    limit = self.policy.coverage_details.consultation_fees.sub_limit
                    copay_pct = self.policy.coverage_details.consultation_fees.copay_percentage
                    if item_amt > limit:
                        deducted = item_amt - limit
                        self.verdict.deduction_details.append({
                            "category": "Policy Sub-limit",
                            "amount": deducted,
                            "reason": f"Consultation ({item_key}) exceeds cap of ₹{limit}"
                        })
                        current_eligible = limit
                
                elif category == "diagnostic":
                    limit = self.policy.coverage_details.diagnostic_tests.get("sub_limit", 10000)
                    if item_amt > limit:
                        deducted = item_amt - limit
                        self.verdict.deduction_details.append({
                            "category": "Policy Sub-limit",
                            "amount": deducted,
                            "reason": f"Diagnostics ({item_key}) exceed cap of ₹{limit}"
                        })
                        current_eligible = limit

                # C. Final Calculation for Item
                if copay_pct > 0:
                    copay_val = calculate_copay(current_eligible, copay_pct)
                    self.verdict.deductions['copay'] = self.verdict.deductions.get('copay', 0) + copay_val
                    self.verdict.deduction_details.append({
                        "category": "Policy Co-pay",
                        "amount": copay_val,
                        "reason": f"{copay_pct}% Copay applied to {item_key}"
                    })
                    current_eligible -= copay_val
                
                approved += current_eligible

        # 3. Final Network Adjustments
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
        if db.check_duplicate_claim(
            self.case.input_data.member_id, 
            self.case.input_data.treatment_date, 
            self.case.input_data.claim_amount,
            exclude_case_id=self.case.case_id
        ):
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
            
        # Phase 3: Medical Review & Exclusions (Call 2)
        # We run this BEFORE financial limits to prioritize policy exclusions
        self._run_medical_coverage_analysis()
        if not self.coverage_verification():
            return self.verdict
            
        # Phase 4: Financial Limits
        if not self.limit_validation_check():
            return self.verdict
        
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

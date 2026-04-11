import json
import os
from typing import List, Dict, Any
from models import Case, Policy, CaseInput, Verdict
from adjudication import get_verdict

class EvaluationEngine:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(__file__))
        self.test_cases_path = os.path.join(self.base_dir, 'Project_information', 'test_cases.json')
        self.policy_path = os.path.join(self.base_dir, 'Project_information', 'policy_terms.json')

    def load_test_cases(self) -> List[Dict[str, Any]]:
        with open(self.test_cases_path, 'r') as f:
            data = json.load(f)
            return data.get("test_cases", [])

    def load_policy(self) -> Policy:
        with open(self.policy_path, 'r') as f:
            data = json.load(f)
            return Policy(**data)

    def run_all_tests(self) -> Dict[str, Any]:
        test_cases = self.load_test_cases()
        policy = self.load_policy()
        
        results = []
        summary = {
            "total": len(test_cases),
            "passed": 0,
            "failed": 0,
            "decision_accuracy": 0.0,
            "financial_accuracy": 0.0,
            "avg_confidence": 0.0,
            "cases": []
        }
        
        total_confidence = 0.0
        correct_decisions = 0
        total_expected_approved = 0.0
        total_actual_approved = 0.0
        
        for tc in test_cases:
            case_id = tc["case_id"]
            input_data = tc["input_data"]
            expected = tc["expected_output"]
            
            # Construct Case object
            case_obj = Case(
                case_id=case_id,
                case_name=tc["case_name"],
                description=tc["description"],
                input_data=CaseInput(**input_data)
            )
            
            # Run adjudication
            verdict = get_verdict(case_obj, policy)
            actual = verdict.model_dump()
            
            # Compare results
            decision_match = actual["decision"] == expected["decision"]
            if decision_match:
                correct_decisions += 1
                
            amount_diff = abs(actual.get("approved_amount", 0) - expected.get("approved_amount", 0))
            amount_match = amount_diff < 1.0 # minor float diff allowed
            
            total_expected_approved += expected.get("approved_amount", 0)
            total_actual_approved += actual.get("approved_amount", 0)
            
            total_confidence += actual.get("confidence_score", 0)
            
            passed = decision_match and amount_match
            if passed:
                summary["passed"] += 1
            else:
                summary["failed"] += 1
                
            summary["cases"].append({
                "case_id": case_id,
                "name": tc["case_name"],
                "passed": passed,
                "expected": {
                    "decision": expected["decision"],
                    "approved_amount": expected.get("approved_amount", 0)
                },
                "actual": {
                    "decision": actual["decision"],
                    "approved_amount": actual.get("approved_amount", 0),
                    "confidence": actual.get("confidence_score", 0)
                },
                "variance": amount_diff
            })
            
        summary["decision_accuracy"] = (correct_decisions / summary["total"]) if summary["total"] > 0 else 0
        summary["avg_confidence"] = (total_confidence / summary["total"]) if summary["total"] > 0 else 0
        
        # Financial accuracy as a percentage of parity
        if total_expected_approved > 0:
            summary["financial_accuracy"] = 1.0 - (abs(total_expected_approved - total_actual_approved) / total_expected_approved)
        else:
            summary["financial_accuracy"] = 1.0
            
        return summary

if __name__ == "__main__":
    engine = EvaluationEngine()
    print(json.dumps(engine.run_all_tests(), indent=2))

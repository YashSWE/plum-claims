import json
import sys
import os
from dotenv import load_dotenv
import time

load_dotenv()

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models import Case, Policy
from adjudication import get_verdict

def run_tests():
    # Load policy
    policy_path = os.path.join(os.path.dirname(__file__), '..', 'Project_information', 'policy_terms.json')
    with open(policy_path, 'r') as f:
        policy_data = json.load(f)
    policy = Policy(**policy_data)

    # Load test cases
    test_cases_path = os.path.join(os.path.dirname(__file__), '..', 'Project_information', 'test_cases.json')
    with open(test_cases_path, 'r') as f:
        test_data = json.load(f)
    
    cases = test_data.get('test_cases', [])
    passed = 0
    failed = 0
    
    for test in cases:
        print(f"\n{'='*50}")
        print(f"Running test: {test['case_id']} - {test['case_name']}")
        
        case_obj = Case(
            case_id=test['case_id'],
            case_name=test['case_name'],
            description=test['description'],
            input_data=test['input_data']
        )
        
        verdict = get_verdict(case_obj, policy)
        expected = test['expected_output']
        
        # Compare some core fields
        decision_match = verdict.decision == expected['decision']
        
        # Expected reason output
        expected_reasons = expected.get('rejection_reasons', [])
        reason_match = set(verdict.rejection_reasons) == set(expected_reasons)
        if not expected_reasons and verdict.decision in ["APPROVED", "PARTIAL"]:
             reason_match = True
        elif not reason_match and verdict.decision == "PARTIAL":
             # For partial, check rejected_items
             reason_match = set(verdict.rejection_reasons) == set(expected.get('rejected_items', []))
        
        print(f"Got Decision: {verdict.decision} | Expected: {expected['decision']}")
        if verdict.rejection_reasons:
            print(f"Got Reasons: {verdict.rejection_reasons} | Expected: {expected_reasons or expected.get('rejected_items', [])}")
            
        if verdict.notes:
            print(f"Got Notes: {verdict.notes}")

        if decision_match and reason_match:
            print("✅ PASSED")
            passed += 1
        else:
            print("❌ FAILED")
            failed += 1
        time.sleep(15)

    print(f"\nTest Summary: {passed} passed, {failed} failed.")

if __name__ == '__main__':
    run_tests()

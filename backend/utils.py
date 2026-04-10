from datetime import datetime

def is_within_waiting_period(join_date_str: str, treatment_date_str: str, waiting_days: int) -> bool:
    if not join_date_str or not treatment_date_str:
        return False
    try:
        join_date = datetime.strptime(join_date_str, "%Y-%m-%d")
        treatment_date = datetime.strptime(treatment_date_str, "%Y-%m-%d")
        delta = (treatment_date - join_date).days
        return delta <= waiting_days
    except ValueError:
        return False

def calculate_copay(amount: float, copay_percentage: float) -> float:
    return (amount * copay_percentage) / 100.0

def is_after_deadline(treatment_date_str: str, submit_date_str: str, max_days: int) -> bool:
    if not treatment_date_str or not submit_date_str:
        return False
    try:
        treatment_date = datetime.strptime(treatment_date_str, "%Y-%m-%d")
        submit_date = datetime.strptime(submit_date_str, "%Y-%m-%d")
        delta = (submit_date - treatment_date).days
        return delta > max_days
    except ValueError:
        return False

import os
import json
from PIL import Image, ImageDraw, ImageFont
from datetime import datetime

# Configure base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
TEST_CASES_PATH = os.path.join(PROJECT_ROOT, "Project_information", "test_cases.json")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "test_images")

# Font paths for macOS
FONT_SANS = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_MONO = "/System/Library/Fonts/Supplemental/Courier New.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except IOError:
        return ImageFont.load_default()

def generate_prescription_image(case_id, data):
    img = Image.new('RGB', (800, 1000), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    font_title = get_font(FONT_SANS, 36)
    font_text = get_font(FONT_SANS, 24)
    font_small = get_font(FONT_SANS, 18)
    font_rx = get_font(FONT_SANS, 48)

    # Header
    draw.rectangle([0, 0, 800, 150], fill=(240, 248, 255))
    draw.text((400, 40), "MEDICAL CARE CENTER", fill=(25, 25, 112), font=font_title, anchor="ms")
    
    prescription = data.get("prescription", {})
    doctor = prescription.get("doctor_name", "Dr. General")
    reg_no = prescription.get("doctor_reg", "REG-00000")
    
    draw.text((100, 80), f"Dr. {doctor}", fill=(0, 0, 0), font=font_text)
    draw.text((100, 110), "MBBS, MD Specialist", fill=(100, 100, 100), font=font_small)
    draw.text((700, 110), f"Reg. No: {reg_no}", fill=(100, 100, 100), font=font_small, anchor="rs")
    
    draw.line((50, 150, 750, 150), fill=(25, 25, 112), width=3)

    # Info Section
    draw.text((100, 180), f"Patient: {data.get('member_name', 'Patient')}", fill=(0, 0, 0), font=font_text)
    draw.text((100, 215), f"Date: {data.get('treatment_date', '2026-04-11')}", fill=(0, 0, 0), font=font_text)
    draw.text((700, 180), f"Case ID: {case_id}", fill=(100, 100, 100), font=font_small, anchor="rs")
    
    # Diagnosis
    draw.text((100, 280), "DIAGNOSIS:", fill=(25, 25, 112), font=font_text)
    draw.text((120, 315), prescription.get("diagnosis", "N/A"), fill=(0, 0, 0), font=font_text)

    # Rx Symbol
    draw.text((80, 400), "Rx", fill=(178, 34, 34), font=font_rx)
    
    y_pos = 460
    # Medicines
    if "medicines_prescribed" in prescription:
        for med in prescription["medicines_prescribed"]:
            draw.text((120, y_pos), f"• {med}", fill=(0, 0, 0), font=font_text)
            y_pos += 45
    
    # Procedures / Tests
    if "procedures" in prescription:
        y_pos += 20
        draw.text((100, y_pos), "PROCEDURES ADVISED:", fill=(25, 25, 112), font=font_text)
        y_pos += 40
        for proc in prescription["procedures"]:
            draw.text((120, y_pos), f"• {proc}", fill=(0, 0, 0), font=font_text)
            y_pos += 40

    if "tests_prescribed" in prescription:
        y_pos += 20
        draw.text((100, y_pos), "INVESTIGATIONS:", fill=(25, 25, 112), font=font_text)
        y_pos += 40
        for test in prescription["tests_prescribed"]:
            draw.text((120, y_pos), f"• {test}", fill=(0, 0, 0), font=font_text)
            y_pos += 40

    # Footer
    draw.line((100, 850, 700, 850), fill=(200, 200, 200), width=1)
    draw.text((400, 920), "Digitally Signed by Clinician", fill=(150, 150, 150), font=font_small, anchor="ms")
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filename = f"{case_id}_prescription.jpg"
    img.save(os.path.join(OUTPUT_DIR, filename), quality=95)
    return filename

def generate_bill_image(case_id, data):
    img = Image.new('RGB', (800, 1000), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    font_title = get_font(FONT_MONO, 32)
    font_text = get_font(FONT_MONO, 22)
    font_bold = get_font(FONT_MONO, 26)

    # Header
    hospital = data.get("hospital", "CITY GENERAL HOSPITAL")
    draw.text((400, 50), hospital.upper(), fill=(0, 0, 0), font=font_title, anchor="ms")
    draw.text((400, 90), "INVOICE / RECEIPT", fill=(0, 0, 0), font=font_text, anchor="ms")
    
    draw.line((80, 120, 720, 120), fill=(0, 0, 0), width=2)

    # Info Section
    draw.text((100, 150), f"Patient: {data.get('member_name', 'Patient')}", fill=(0, 0, 0), font=font_text)
    draw.text((100, 185), f"Date: {data.get('treatment_date', '2026-04-11')}", fill=(0, 0, 0), font=font_text)
    draw.text((700, 150), f"Bill #: B-{case_id}", fill=(0, 0, 0), font=font_text, anchor="rs")
    
    draw.line((80, 230, 720, 230), fill=(0, 0, 0), width=2)
    
    # Table Header
    draw.text((100, 250), "PARTICULARS", fill=(0, 0, 0), font=font_bold)
    draw.text((700, 250), "AMOUNT (INR)", fill=(0, 0, 0), font=font_bold, anchor="rs")
    draw.line((80, 285, 720, 285), fill=(0, 0, 0), width=1)
    
    y_pos = 320
    bill_data = data.get("bill", {})
    total_raw = 0
    
    for key, value in bill_data.items():
        if key == "test_names": continue
        item_name = key.replace("_", " ").title()
        draw.text((100, y_pos), item_name, fill=(0, 0, 0), font=font_text)
        draw.text((700, y_pos), f"{value:,.2f}", fill=(0, 0, 0), font=font_text, anchor="rs")
        total_raw += value
        y_pos += 45
        
    draw.line((80, 750, 720, 750), fill=(0, 0, 0), width=2)
    
    # Totals
    gst = int(total_raw * 0.18)
    total_final = total_raw + gst
    
    draw.text((450, 780), "Subtotal:", fill=(0, 0, 0), font=font_text)
    draw.text((700, 780), f"{total_raw:,.2f}", fill=(0, 0, 0), font=font_text, anchor="rs")
    
    draw.text((450, 820), "GST (18%):", fill=(0, 0, 0), font=font_text)
    draw.text((700, 820), f"{gst:,.2f}", fill=(0, 0, 0), font=font_text, anchor="rs")
    
    draw.text((450, 870), "TOTAL:", fill=(0, 0, 0), font=font_bold)
    draw.text((700, 870), f"{total_final:,.2f}", fill=(0, 0, 0), font=font_bold, anchor="rs")
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filename = f"{case_id}_bill.jpg"
    img.save(os.path.join(OUTPUT_DIR, filename), quality=95)
    return filename

def main():
    print(f"Loading test cases from {TEST_CASES_PATH}...")
    with open(TEST_CASES_PATH, 'r') as f:
        config = json.load(f)
    
    test_cases = config.get("test_cases", [])
    print(f"Generating images for {len(test_cases)} cases...")
    
    for case in test_cases:
        case_id = case["case_id"]
        input_data = case["input_data"]
        
        print(f"Processing {case_id}...")
        
        # Generate Prescription if possible
        if "prescription" in input_data.get("documents", {}):
            doc_data = input_data.copy() # Flatten for convenience
            doc_data.update(input_data["documents"])
            generate_prescription_image(case_id, doc_data)
            
        # Generate Bill if possible
        if "bill" in input_data.get("documents", {}):
            doc_data = input_data.copy()
            doc_data.update(input_data["documents"])
            generate_bill_image(case_id, doc_data)
            
    print(f"Done! Images generated in {OUTPUT_DIR}")

if __name__ == "__main__":
    main()

import numpy as np
import cv2
from sklearn.ensemble import GradientBoostingClassifier

class MultiModalFusion:
    def __init__(self):
        self.tabular_model = GradientBoostingClassifier(
            n_estimators=100,
            max_depth=3,
            learning_rate=0.1,
            random_state=42
        )
    
    def preprocess_image(self, image):
        if image is None:
            return None
        if isinstance(image, np.ndarray):
            img = cv2.resize(image, (224, 224))
            img = img / 255.0
            return img
        return None
    
    def predict(self, image, patient_data):
        # Image risk
        if image is not None:
            if len(image.shape) == 3:
                gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
            else:
                gray = image
            mean_brightness = np.mean(gray)
            image_risk = 0.3 + (mean_brightness / 255) * 0.5
        else:
            image_risk = 0.12
        
        # Get vitals
        glucose = patient_data['vitals'].get('glucose', 120)
        heart_rate = patient_data['vitals'].get('heart_rate', 80)
        spo2 = patient_data['vitals'].get('spo2', 98)
        
        # Calculate risks
        if glucose < 100:
            glucose_risk = 0.10
        elif glucose < 126:
            glucose_risk = 0.35
        elif glucose < 200:
            glucose_risk = 0.70
        else:
            glucose_risk = 0.90
            
        if heart_rate <= 100:
            heart_risk = 0.10
        elif heart_rate <= 120:
            heart_risk = 0.45
        elif heart_rate <= 140:
            heart_risk = 0.70
        else:
            heart_risk = 0.90
            
        if spo2 >= 95:
            spo2_risk = 0.10
        elif spo2 >= 90:
            spo2_risk = 0.60
        elif spo2 >= 80:
            spo2_risk = 0.85
        else:
            spo2_risk = 0.98
        
        # Lab report risk (simulated if file was present)
        lab_risk = 0.0
        if 'lab_data' in patient_data:
             # If lab data indicates issues
             if patient_data['lab_data'].get('abnormal', False):
                 lab_risk = 0.6
        
        # Fusion score
        fusion_score = (image_risk * 0.35 + glucose_risk * 0.25 + heart_risk * 0.15 + spo2_risk * 0.15 + lab_risk * 0.1)
        
        # Risk level & Triage
        if fusion_score > 0.6:
            risk_level = 'HIGH'
            triage_color = 'RED'
            confidence = 0.89
            action = "Immediate Hospitalization"
        elif fusion_score > 0.35:
            risk_level = 'MEDIUM'
            triage_color = 'YELLOW'
            confidence = 0.76
            action = "Specialist Consultation"
        else:
            risk_level = 'LOW'
            triage_color = 'GREEN'
            confidence = 0.94
            action = "Routine Checkup"
        
        # Diseases
        diseases = []
        if image is not None and fusion_score > 0.6:
            diseases.append({"name": "Community Acquired Pneumonia", "probability": 0.87, "icd10": "J15.9"})
        if glucose > 200:
            diseases.append({"name": "Type 2 Diabetes - Uncontrolled", "probability": 0.92, "icd10": "E11.65"})
        elif glucose > 126:
            diseases.append({"name": "Type 2 Diabetes Mellitus", "probability": 0.82, "icd10": "E11.9"})
        
        sys_bp = patient_data['vitals']['blood_pressure']['systolic']
        if sys_bp > 140:
             diseases.append({"name": "Essential Hypertension", "probability": 0.85, "icd10": "I10"})
             
        if spo2 < 90:
             diseases.append({"name": "Hypoxemia / Respiratory Insufficiency", "probability": 0.91, "icd10": "R09.02"})

        if not diseases:
            diseases.append({"name": "No Acute Pathology", "probability": 0.94, "icd10": "Z00.00"})
        
        # Feature importance
        feature_importance = {
            'Chest X-Ray': round(image_risk * 100, 1),
            'Blood Glucose': round(glucose_risk * 100, 1),
            'Heart Rate': round(heart_risk * 100, 1),
            'SpO2': round(spo2_risk * 100, 1),
            'Blood Pressure': round((sys_bp/180)*100, 1) if sys_bp > 120 else 10
        }
        
        # Treatment plan & Drug Interactions
        medications = []
        has_pneumonia = any('Pneumonia' in d['name'] for d in diseases)
        has_diabetes = any('Diabetes' in d['name'] for d in diseases)
        has_htn = any('Hypertension' in d['name'] for d in diseases)
        
        if has_pneumonia:
            medications.append({"name": "Amoxicillin-Clavulanate", "dose": "875/125 mg", "frequency": "BID", "duration": "7 days"})
            medications.append({"name": "Azithromycin", "dose": "500 mg", "frequency": "QD", "duration": "3 days"})
        if has_diabetes:
            medications.append({"name": "Metformin", "dose": "500 mg", "frequency": "BID", "duration": "Ongoing"})
        if has_htn:
             medications.append({"name": "Amlodipine", "dose": "5 mg", "frequency": "QD", "duration": "Ongoing"})
             
        if not medications:
             medications.append({"name": "Multivitamin", "dose": "1 tablet", "frequency": "QD", "duration": "30 days"})
        
        # Check Drug Interactions (Mock)
        interactions = []
        if has_pneumonia and has_htn:
            interactions.append("Monitor for potential interaction between Azithromycin and Amlodipine (minor).")

        if risk_level == 'HIGH':
            procedures = ["Chest X-ray follow-up in 2 weeks", "Complete Blood Count", "HbA1c", "12-lead ECG", "Urgent Pulmonology Referral"]
        elif risk_level == 'MEDIUM':
            procedures = ["Basic Metabolic Panel", "Follow-up in 1 month", "Dietary Consultation"]
        else:
            procedures = ["Annual physical examination", "Flu Vaccination"]
        
        medication_cost = len(medications) * 150 * (30 if risk_level == 'HIGH' else 10)
        lab_tests = 2500 if risk_level == 'HIGH' else 800 if risk_level == 'MEDIUM' else 0
        total_cost = 500 + medication_cost + lab_tests
        
        treatment_plan = {
            "medications": medications,
            "procedures": procedures,
            "follow_up": "2 days" if risk_level == 'HIGH' else "1 week" if risk_level == 'MEDIUM' else "1 year",
            "lifestyle": ["Low salt diet", "Regular exercise 30mins/day"] if has_htn else ["General healthy diet"],
            "drug_interactions": interactions,
            "cost_estimate": {
                "consultation": 500,
                "medications": medication_cost,
                "lab_tests": lab_tests,
                "total": total_cost
            }
        }
        
        return {
            "risk_score": float(fusion_score),
            "risk_level": risk_level,
            "triage": {"color": triage_color, "action": action},
            "confidence": confidence,
            "diseases": diseases,
            "feature_importance": feature_importance,
            "treatment_plan": treatment_plan,
            "treatment_cost": treatment_plan['cost_estimate']['total']
        }

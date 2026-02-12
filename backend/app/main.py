from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import io
import uuid
from datetime import datetime
import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Use RELATIVE imports (with dot)
from .models.fusion_model import MultiModalFusion
from .models.fairness import FairnessAuditor
from .services.loan_service import LoanEligibilityChecker
from .services.llm_service import LLMService
from .services.tts_service import CloudTTSService
from .services.vision_service import VisionService
from .services.ollama_service import OllamaService
from .services.story_video_service import StoryVideoService


app = FastAPI(title="Nexus AI Healthcare Backend", version="2.0.0")

# CORS Configuration
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:5174",  # Added for frontend
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

fusion_model = MultiModalFusion()
fairness_auditor = FairnessAuditor()
loan_checker = LoanEligibilityChecker()
llm_service = LLMService()
tts_service = CloudTTSService()
vision_service = VisionService()
ollama_service = OllamaService()
story_video_service = StoryVideoService()

# In-memory audit log for demo / doctor dashboard
audit_logs: list[dict] = []

@app.get("/")
async def root():
    return {"message": "Seva AI Backend Running", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model": "Seva AI v2.0"}

@app.post("/api/diagnose")
async def diagnose(
    image: UploadFile = File(None),
    lab_report: UploadFile = File(None),
    glucose: float = Form(120),
    heart_rate: float = Form(80),
    systolic: float = Form(120),
    diastolic: float = Form(80),
    spo2: float = Form(98),
    temperature: float = Form(98.6),
    age: int = Form(45),
    gender: str = Form("Female"),
    symptoms: str = Form(""),
    income: float = Form(25000),
    language: str = Form("en")
):
    try:
        print(f"🔍 Diagnosis request received - Language: {language}, Symptoms: {symptoms}")
        
        image_array = None
        if image:
            contents = await image.read()
            pil_image = Image.open(io.BytesIO(contents)).convert('RGB')
            image_array = np.array(pil_image)
            print(f"📷 Image uploaded: {image.filename}, shape: {image_array.shape}")
        
        # Mock Lab Report Processing
        lab_data = {}
        if lab_report:
            lab_data['abnormal'] = 'abnormal' in lab_report.filename.lower()
            print(f"📄 Lab report uploaded: {lab_report.filename}")
        
        patient_data = {
            "vitals": {
                "glucose": glucose,
                "heart_rate": heart_rate,
                "blood_pressure": {"systolic": systolic, "diastolic": diastolic},
                "spo2": spo2,
                "temperature": temperature
            },
            "demographics": {
                "age": age,
                "gender": gender
            },
            "symptoms": symptoms,
            "income": income,
            "lab_data": lab_data
        }
        
        print(f"🏥 Running diagnosis with patient data...")
        diagnosis = fusion_model.predict(image_array, patient_data)
        fairness_report = fairness_auditor.audit(age, gender)
        loan_eligibility = loan_checker.check_eligibility(income, diagnosis["treatment_cost"])
        
        print(f"🤖 Running LLM translation to {language}...")
        translated_analysis = llm_service.analyze_and_translate(diagnosis, patient_data, language)

        patient_id = f"PAT-{uuid.uuid4().hex[:8].upper()}"
        timestamp = datetime.now().isoformat()

        # Use translated explanation if available
        explanation = translated_analysis.get("explanation", diagnosis['risk_level'])
        
        detailed_explanation = []
        for d in diagnosis['diseases']:
            detailed_explanation.append(f"- {d['name']} ({int(d['probability']*100)}% confidence)")
        
        response = {
            "patient_id": patient_id,
            "risk": diagnosis['risk_level'],
            "risk_score": diagnosis['risk_score'],
            "confidence": diagnosis['confidence'],
            "explanation": explanation,
            "dietTips": translated_analysis.get("diet_tips", []),
            "medicationGuide": translated_analysis.get("medication_guide", ""),
            "detailedExplanation": detailed_explanation,
            "featureImportance": [
                {"name": k, "value": v, "color": "#3b82f6"}
                for k, v in diagnosis['feature_importance'].items()
            ],
            "diseases": diagnosis['diseases'],
            "treatmentPlan": diagnosis['treatment_plan'],
            "fairnessMetrics": fairness_report,
            "loanEligibility": loan_eligibility,
            "timestamp": timestamp,
        }

        audit_logs.append(
            {
                "patient_id": patient_id,
                "timestamp": timestamp,
                "risk": diagnosis["risk_level"],
                "risk_score": diagnosis["risk_score"],
                "confidence": diagnosis["confidence"],
                "diseases": diagnosis["diseases"],
                "demographics": patient_data["demographics"],
                "symptoms": symptoms,
            }
        )
        
        print(f"✅ Diagnosis complete for {patient_id} - Risk: {diagnosis['risk_level']}")
        # Generate Farm Story using Ollama (Feature 2)
        farm_story = ollama_service.generate_farm_story(diagnosis, language)
        
        # Extract diet recommendations for Thali (Feature 3)
        eat_foods = ["bajra roti", "palak sabzi", "dahi", "moong dal"]
        avoid_foods = ["white chawal", "aloo", "mithai", "tel"]
        
        if diagnosis['risk_level'] == 'high':
            eat_foods = ["khichdi", "dalia", "nimbu pani", "tulsi chai"]
            avoid_foods = ["heavy food", "spicy", "fried", "cold drinks"]
        
        # Add farm story and diet to response
        response["farmStory"] = farm_story
        response["recommended_foods"] = eat_foods
        response["avoid_foods"] = avoid_foods
        response["severity"] = diagnosis.get('risk_score', 5)
        
        return response
        
    except Exception as e:
        print(f"❌ Error in diagnosis: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "error": str(e),
            "patient_id": "ERROR",
            "risk": "unknown",
            "confidence": 0,
            "explanation": f"Analysis failed: {str(e)}",
            "diseases": [],
            "treatmentPlan": {}
        }

@app.post("/api/analyze-report")
async def analyze_medical_report(
    file: UploadFile = File(...),
    language: str = Form("en")
):
    """
    Village Vaidya Report Reader - Analyze medical images/reports using Gemini Vision.
    """
    try:
        print(f"📸 Analyzing medical report in language: {language}")
        contents = await file.read()
        print(f"📄 File: {file.filename}, size: {len(contents)} bytes")
        
        result = await vision_service.analyze_medical_report(contents, language)
        print(f"✅ Analysis complete: Severity {result.get('severity')}/10")
        
        return {
            "success": True,
            "report_type": result.get("report_type", "Medical Report"),
            "key_findings": result.get("key_findings", []),
            "severity": result.get("severity", 5),
            "severity_analogy": result.get("severity_analogy", ""),
            "explanation": result.get("explanation", ""),
            "eat_foods": result.get("eat_foods", []),
            "avoid_foods": result.get("avoid_foods", []),
            "action_needed": result.get("action_needed", "Consult doctor"),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"❌ Report analysis error: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e),
            "explanation": f"Could not analyze report: {str(e)}"
        }

@app.post("/api/generate-farm-story")
async def generate_farm_story(
    diagnosis: dict = Form(...),
    language: str = Form("en")
):
    """
    Generate farm story from diagnosis using Ollama (Feature 2: Farm Story Explainer)
    """
    try:
        print(f"🌾 Generating farm story in {language}")
        
        # Parse diagnosis if it's a JSON string
        import json
        if isinstance(diagnosis, str):
            diagnosis = json.loads(diagnosis)
        
        story = ollama_service.generate_farm_story(diagnosis, language)
        
        return {
            "success": True,
            "farm_story": story,
            "language": language
        }
    except Exception as e:
        print(f"❌ Farm story error: {str(e)}")
        return {
            "success": False,
            "farm_story": "Story generation failed",
            "error": str(e)
        }

@app.post("/api/generate-story-video")
async def generate_story_video(request: dict):
    """
    Generate animated story video from diagnosis (Feature 7: Animated Story Video Explainer)
    """
    try:
        print(f"🎬 Generating story video...")
        
        diagnosis = request.get('diagnosis', {})
        language = request.get('language', 'en')
        
        # Generate story video using Ollama
        story_video = story_video_service.generate_story_video(diagnosis, language)
        
        print(f"✅ Story video generated: {story_video.get('title')}")
        
        return {
            "success": True,
            **story_video
        }
    except Exception as e:
        print(f"❌ Story video generation error: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e),
            "title": "Story Generation Failed",
            "duration": 0,
            "scenes": []
        }

@app.post("/api/tts")
async def text_to_speech(text: str = Form(...), language: str = Form("en-IN")):
    """
    Convert text to speech using Google Cloud TTS
    Returns base64-encoded MP3 audio
    """
    result = tts_service.synthesize_speech(text, language)
    return result

@app.get("/api/fairness-report/{demographic}")
async def get_fairness_report(demographic: str = "all"):
    report = fairness_auditor.full_audit(demographic)
    return report


@app.get("/api/audit-logs")
async def get_audit_logs():
    """Return recent diagnosis audit logs for doctor dashboard."""
    # Return latest first
    return list(reversed(audit_logs[-50:]))


@app.get("/api/patient/{patient_id}")
async def get_patient_summary(patient_id: str):
    for entry in audit_logs:
        if entry["patient_id"] == patient_id:
            return entry
    return {"error": "Patient not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

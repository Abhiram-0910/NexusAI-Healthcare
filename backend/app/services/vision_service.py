import os
import json
import re
import base64
import google.generativeai as genai
from PIL import Image
import io

class VisionService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            # Gemini 2.5 Flash is MULTIMODAL - handles text AND images!
            self.model = genai.GenerativeModel('models/gemini-2.5-flash')
            print("✅ Vision Service: Using Gemini 2.5 Flash (Multimodal - Text + Vision)")
        else:
            print("⚠️ Vision Service: No Gemini API Key found")
    
    async def analyze_medical_report(self, image_bytes: bytes, language: str = "en") -> dict:
        """
        FAST APPROACH: Use Gemini 2.5 Flash directly for vision + analysis
        Gemini 2.5 Flash is multimodal - it can see images AND analyze them!
        No more slow Ollama llava needed!
        Expected time: 5-15 seconds (vs 2-3 minutes with Ollama)
        """
        try:
            print("📸 Analyzing image with Gemini 2.5 Flash (fast multimodal)...")
            
            # Convert image bytes to PIL Image for Gemini
            pil_image = Image.open(io.BytesIO(image_bytes))
            
            language_names = {
                "en": "English", "hi": "Hindi", "te": "Telugu",
                "ta": "Tamil", "kn": "Kannada", "ml": "Malayalam"
            }
            lang_name = language_names.get(language, "English")
            
            # Single prompt: Gemini sees the image AND analyzes it
            prompt = f"""You are a village doctor (Vaidya) in India helping rural patients understand medical reports.

Look at this medical report/image carefully and analyze it:

1. What type of medical report is this? (blood test, X-ray, sugar test, prescription, etc.)
2. List ALL important findings and numbers you can see
3. Rate severity from 1-10 (1=perfectly normal, 10=emergency)
4. Explain using simple farm analogies (e.g. "sugar high = jaise tyohaar mein mithai zyada kha li")
5. Recommend Indian village foods to EAT (bajra, jowar, dal, palak, dahi, etc.)
6. Recommend foods to AVOID (chawal, aloo, mithai, tel, etc.)

Answer in {lang_name} language using very simple words that a farmer can understand.

Return ONLY valid JSON (no markdown, no code blocks):
{{
    "report_type": "type of report",
    "key_findings": ["finding 1", "finding 2", "finding 3"],
    "severity": 5,
    "severity_analogy": "farm analogy for severity",
    "explanation": "simple explanation in {lang_name} using farm analogies",
    "eat_foods": ["food 1", "food 2", "food 3", "food 4"],
    "avoid_foods": ["food 1", "food 2", "food 3"],
    "action_needed": "what patient should do next"
}}"""

            # Send image + prompt to Gemini (multimodal call)
            response = self.model.generate_content([prompt, pil_image])
            text = response.text
            
            print(f"✅ Gemini vision response received ({len(text)} chars)")
            
            # Parse JSON from response
            # Try extracting from code blocks first
            json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group(1))
            else:
                # Try parsing the whole response as JSON
                # Clean up any leading/trailing non-JSON content
                text_clean = text.strip()
                if text_clean.startswith('{'):
                    result = json.loads(text_clean)
                else:
                    # Find JSON object in text
                    json_start = text_clean.find('{')
                    json_end = text_clean.rfind('}') + 1
                    if json_start >= 0 and json_end > json_start:
                        result = json.loads(text_clean[json_start:json_end])
                    else:
                        # Fallback: create structured response from text
                        result = {
                            "report_type": "Medical Report",
                            "key_findings": [text[:200]],
                            "severity": 5,
                            "severity_analogy": "Needs doctor review",
                            "explanation": text[:500],
                            "eat_foods": ["bajra roti", "palak", "dahi", "moong dal"],
                            "avoid_foods": ["chawal", "mithai", "tel"],
                            "action_needed": "Consult doctor"
                        }
            
            print(f"✅ Analysis complete! Report: {result.get('report_type')}, Severity: {result.get('severity')}/10")
            return result
            
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Vision analysis error: {error_msg}")
            
            # If Gemini multimodal fails, return helpful error
            return {
                "report_type": "Analysis Error",
                "key_findings": [f"Could not analyze: {error_msg[:100]}"],
                "severity": 0,
                "severity_analogy": "Analysis could not be completed",
                "explanation": f"Image analysis failed. Please try again or describe your report manually. Error: {error_msg[:200]}",
                "eat_foods": ["bajra roti", "palak sabzi", "dahi", "moong dal"],
                "avoid_foods": ["processed food", "excessive sugar", "fried items"],
                "action_needed": "Please try uploading again or consult a doctor directly"
            }

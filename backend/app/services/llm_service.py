import os
import json
import google.generativeai as genai

# Make OpenAI optional
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

class LLMService:
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.openai_key = os.getenv("OPENAI_API_KEY")
        
        if self.gemini_key:
            genai.configure(api_key=self.gemini_key)
            self.model = genai.GenerativeModel('models/gemini-1.5-flash')
            print("✅ LLM Service: Using Google Gemini 1.5 Flash")
        elif self.openai_key and OPENAI_AVAILABLE:
            self.client = OpenAI(api_key=self.openai_key)
            print("✅ LLM Service: Using OpenAI GPT")
        else:
            print("⚠️ LLM Service: No API Keys found. Using Smart Mock Mode.")

    def analyze_and_translate(self, diagnosis_result, patient_data, target_lang="en"):
        """
        Takes the raw diagnosis and returns a culturally adapted, translated explanation.
        """
        
        # 1. If we have keys, use Real AI
        if self.gemini_key or self.openai_key:
            return self._call_real_llm(diagnosis_result, patient_data, target_lang)
        
        # 2. Fallback: Smart Mock
        return self._smart_mock_response(diagnosis_result, target_lang)

    def _call_real_llm(self, diagnosis, patient, lang):
        prompt = f"""
        You are an empathetic AI Doctor acting as a village health worker. 
        
        Patient Data:
        - Age: {patient['demographics']['age']}
        - Gender: {patient['demographics']['gender']}
        - Symptoms: {patient['symptoms']}
        - Risk Level: {diagnosis['risk_level']}
        - Detected: {', '.join([d['name'] for d in diagnosis['diseases']])}
        - Treatment: {', '.join([m['name'] for m in diagnosis['treatment_plan']['medications']])}

        Task:
        1. Explain the diagnosis clearly in {lang} language.
        2. Provide 3 specific diet/lifestyle tips relevant to Indian culture.
        3. Explain the medication simply (e.g., "Take the white pill after food").
        
        Return ONLY a JSON object with keys: "explanation", "diet_tips", "medication_guide".
        """
        
        try:
            if self.gemini_key:
                response = self.model.generate_content(prompt)
                text = response.text.replace('```json', '').replace('```', '')
                return json.loads(text)
            elif self.openai_key:
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "system", "content": "You are a medical translator."}, 
                              {"role": "user", "content": prompt}]
                )
                text = response.choices[0].message.content
                return json.loads(text)
        except Exception as e:
            print(f"LLM Error: {e}")
            return self._smart_mock_response(diagnosis, lang)

    def _smart_mock_response(self, diagnosis, lang):
        """
        Returns pre-translated templates based on risk level.
        Supported: en, hi, te, ta, kn, ml
        """
        risk = diagnosis['risk_level']
        
        # Templates for explanations
        templates = {
            "en": {
                "HIGH": "Your condition requires immediate attention. Please visit a hospital now.",
                "MEDIUM": "You have some symptoms that need care. Please see a doctor soon.",
                "LOW": "You seem to be healthy. Rest well and drink water.",
                "tips": ["Eat fresh vegetables", "Drink boiled water", "Avoid spicy food"]
            },
            "hi": { # Hindi
                "HIGH": "आपकी स्थिति गंभीर लग रही है। कृपया तुरंत अस्पताल जाएं।",
                "MEDIUM": "आपको कुछ लक्षण हैं जिन पर ध्यान देने की आवश्यकता है। कृपया डॉक्टर से मिलें।",
                "LOW": "आप स्वस्थ लग रहे हैं। आराम करें और खूब पानी पिएं।",
                "tips": ["ताजी सब्जियां खाएं", "उबला हुआ पानी पिएं", "मसालेदार खाने से बचें"]
            },
            "te": { # Telugu
                "HIGH": "మీ పరిస్థితి తీవ్రంగా ఉంది. దయచేసి వెంటనే ఆసుపత్రికి వెళ్లండి.",
                "MEDIUM": "మీకు వైద్య సహాయం అవసరమైన కొన్ని లక్షణాలు ఉన్నాయి. దయచేసి డాక్టర్‌ను సంప్రదించండి.",
                "LOW": "మీరు ఆరోగ్యంగా ఉన్నట్లు అనిపిస్తుంది. విశ్రాంతి తీసుకోండి మరియు నీరు త్రాగండి.",
                "tips": ["తాజా కూరగాయలు తినండి", "కాచి చల్లార్చిన నీరు త్రాగండి", "కారం తగ్గించండి"]
            },
            "ta": { # Tamil
                "HIGH": "உங்கள் நிலைமை கவலைக்கிடமாக உள்ளது. உடனடியாக மருத்துவமனைக்குச் செல்லுங்கள்.",
                "MEDIUM": "உங்களுக்கு மருத்துவ கவனிப்பு தேவை. மருத்துவரைப் பாருங்கள்.",
                "LOW": "நீங்கள் ஆரோக்கியமாக உள்ளீர்கள். ஓய்வெடுங்கள்.",
                "tips": ["காய்கறிகள் அதிகம் உண்ணுங்கள்", "சுடு தண்ணீர் குடிக்கவும்", "காரத்தை தவிர்க்கவும்"]
            },
            "kn": { # Kannada
                "HIGH": "ನಿಮ್ಮ ಸ್ಥಿತಿ ಗಂಭೀರವಾಗಿದೆ. ದಯವಿಟ್ಟು ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ.",
                "MEDIUM": "ನಿಮಗೆ ವೈದ್ಯಕೀಯ ಸಲಹೆ ಬೇಕಾಗಬಹುದು. ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಕಾಣಿರಿ.",
                "LOW": "ನೀವು ಆರೋಗ್ಯವಾಗಿದ್ದೀರಿ. ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.",
                "tips": ["ತಾಜಾ ತರಕಾರಿಗಳನ್ನು ಸೇವಿಸಿ", "ಬಿಸಿ ನೀರು ಕುಡಿಯಿರಿ", "ಖಾರ ಕಡಿಮೆ ಮಾಡಿ"]
            },
            "ml": { # Malayalam
                "HIGH": "നിങ്ങളുടെ അവസ്ഥ ഗുരുതരമാണ്. ഉടൻ തന്നെ ആശുപത്രിയിൽ പോകുക.",
                "MEDIUM": "നിങ്ങൾക്ക് വൈദ്യസഹായം ആവശ്യമാണ്. ഡോക്ടറെ കാണുക.",
                "LOW": "നിങ്ങൾക്ക് കുഴപ്പമില്ലെന്ന് തോന്നുന്നു. വിശ്രമിക്കുക.",
                "tips": ["പച്ചക്കറികൾ കഴിക്കുക", "തിളപ്പിച്ചാറ്റിയ വെള്ളം കുടിക്കുക", "എരിവ് ഒഴിവാക്കുക"]
            },
        }

        # Select Lang (Default to English if missing)
        lang_data = templates.get(lang) or templates.get(lang.split('-')[0]) or templates['en']
        
        return {
            "explanation": lang_data[risk],
            "diet_tips": lang_data["tips"],
            "medication_guide": "Take prescribed medicines after food. (డాక్టర్ సలహా మేరకు మందులు వాడండి)" if lang.startswith('te') else "Follow doctor's advice."
        }

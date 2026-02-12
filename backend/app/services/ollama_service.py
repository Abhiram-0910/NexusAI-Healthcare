import ollama

class OllamaService:
    def __init__(self):
        self.model = "llama3"  # or mistral
        try:
            # Test if Ollama is running
            ollama.list()
            self.available = True
            print("✅ Ollama Service: Connected to local LLM")
        except Exception as e:
            self.available = False
            print(f"⚠️ Ollama Service: Not available - {str(e)}")
    
    def generate_farm_story(self, medical_diagnosis: dict, language: str = "en") -> str:
        """
        Convert medical diagnosis into a simple farm story using village analogies.
        Uses local Ollama for offline-capable explanations.
        """
        if not self.available:
            return self._fallback_story(medical_diagnosis, language)
        
        try:
            # Create prompt for farm story generation
            language_names = {
                "en": "English",
                "hi": "Hindi (हिंदी)",
                "te": "Telugu (తెలుగు)",
                "ta": "Tamil (தமிழ்)",
                "kn": "Kannada (ಕನ್ನಡ)",
                "ml": "Malayalam (മലയാളം)"
            }
            lang_name = language_names.get(language, "English")
            
            diseases = ', '.join([d['name'] for d in medical_diagnosis.get('diseases', [])])
            risk_level = medical_diagnosis.get('risk_level', 'medium')
            treatment = ', '.join([m['name'] for m in medical_diagnosis.get('treatment_plan', {}).get('medications', [])])
            
            prompt = f"""You are a village elder (Uncle ji) in rural India. A farmer has come to you for health advice.

Medical Diagnosis:
- Health Problem: {diseases or 'General checkup'}
- Risk Level: {risk_level}
- Treatment Needed: {treatment or 'Rest and care'}

Your Task:
Explain this health problem using SIMPLE farm and village analogies that any farmer can understand.

Use analogies like:
- Crops (fasal) - healthy vs diseased
- Rain (barsaat) - too much or too little
- Bull/Animals - strong vs weak
- Harvest (fasal kaatna) - good vs bad yield
- Fields (khet) - fertile vs barren

IMPORTANT:
1. Speak in {lang_name} language
2. Use "Bhai" or "Beta" to address the patient
3. Make it a 30-40 second story (about 50-80 words)
4. End with EXACT foods to eat and avoid (Indian village foods only)
5. Be warm and caring like a real village uncle

Example (English): "Bhai, your sugar is high, jaise tyohaar mein mithai zyada kha liya. Your body is like a field that got too much fertilizer. Now you need to balance it. Eat: bajra roti, pal

ak sabzi, dahi. Avoid: white chawal, aloo, mithai, cold drinks. Walk 2 km daily like going to the field."

Now create a similar story in {lang_name}:"""

            response = ollama.chat(
                model=self.model,
                messages=[{'role': 'user', 'content': prompt}]
            )
            
            story = response['message']['content']
            print(f"✅ Farm story generated in {lang_name}")
            return story
            
        except Exception as e:
            print(f"❌ Ollama story generation error: {str(e)}")
            return self._fallback_story(medical_diagnosis, language)
    
    def _fallback_story(self, diagnosis: dict, language: str) -> str:
        """Fallback story when Ollama is not available"""
        stories = {
            "en": f"Bhai, your health needs attention like a crop needs water. The doctor says you have {diagnosis.get('risk_level', 'medium')} risk. Take care of yourself like you take care of your field. Eat simple village food, walk daily, and rest well.",
            "hi": f"भाई, आपकी सेहत को ध्यान चाहिए जैसे फसल को पानी। डॉक्टर कहते हैं आपको {diagnosis.get('risk_level', 'मध्यम')} खतरा है। अपना ख्याल रखो जैसे खेत का। सादा गाँव का खाना खाओ, रोज चलो, आराम करो।",
            "te": f"అన్నయ్య, మీ ఆరోగ్యానికి శ్రద్ధ కావాలి పంటకు నీరు అవసరం అయినట్లు. డాక్టర్ చెప్పారు మీకు {diagnosis.get('risk_level', 'మధ్యస్థ')} ప్రమాదం ఉంది. పొలం చూసుకున్నట్లు మిమ్మల్ని చూసుకోండి।"
        }
        return stories.get(language, stories["en"])
    
    def analyze_symptoms_offline(self, symptoms: str, language: str = "en") -> dict:
        """
        Offline diagnosis using only Ollama (for Gaon Doctor mode when internet is down)
        """
        if not self.available:
            return {
                "diagnosis": "Ollama not available",
                "severity": 0,
                "advice": "Please check internet connection"
            }
        
        try:
            prompt = f"""You are a village health worker in rural India. A patient describes these symptoms: {symptoms}

Based on these symptoms, provide:
1. Possible health problem (in simple words)
2. Severity (1-10 scale)
3. Simple advice in village language

Answer in {language} language. Keep it very simple like talking to a farmer.

Format your answer as:
Problem: [problem name]
Severity: [number]/10
Advice: [simple advice using farm analogies]
"""

            response = ollama.chat(
                model=self.model,
                messages=[{'role': 'user', 'content': prompt}]
            )
            
            result_text = response['message']['content']
            
            # Parse the response
            import re
            severity_match = re.search(r'Severity:\s*(\d+)', result_text)
            severity = int(severity_match.group(1)) if severity_match else 5
            
            return {
                "diagnosis": result_text,
                "severity": severity,
                "advice": result_text,
                "offline_mode": True
            }
            
        except Exception as e:
            print(f"❌ Offline diagnosis error: {str(e)}")
            return {
                "diagnosis": "Analysis failed",
                "severity": 0,
                "advice": str(e)
            }

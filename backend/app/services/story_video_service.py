import ollama
import json

class StoryVideoService:
    def __init__(self):
        self.model = "llama3"
        try:
            ollama.list()
            self.available = True
            print("✅ Story Video Service: Connected to Ollama")
        except Exception as e:
            self.available = False
            print(f"⚠️ Story Video Service: Ollama not available - {str(e)}")
    
    def generate_story_video(self, diagnosis: dict, language: str = "en") -> dict:
        """
        Generate animated story video script from diagnosis.
        Returns: Story with 5 scenes, narration, and visual instructions.
        """
        if not self.available:
            return self._fallback_story(diagnosis, language)
        
        try:
            # Extract diagnosis info
            diseases = diagnosis.get('diseases', [])
            disease_name = diseases[0]['name'] if diseases else 'Health Issue'
            severity = diagnosis.get('severity', 5)
            risk_level = diagnosis.get('risk_level', 'medium')
            
            # Language configurations
            language_names = {
                "en": "English",
                "hi": "Hindi (हिंदी)",
                "te": "Telugu (తెలుగు)",
                "ta": "Tamil (தமிழ்)",
                "kn": "Kannada (ಕನ್ನಡ)",
                "ml": "Malayalam (മലയാളം)"
            }
            lang_name = language_names.get(language, "English")
            
            # Create prompt for story generation
            prompt = f"""You are a village storyteller (kathavachak) in rural India. Create a 45-second animated story to explain {disease_name} to an uneducated farmer.

REQUIREMENTS:
- Language: {lang_name}
- Total Duration: 45 seconds
- 5 scenes (each 9 seconds)
- Use farm/village analogies ONLY
- Simple words that a farmer understands
- Include food advice
- End with hope and encouragement

STORY STRUCTURE:
Scene 1 (9s): Greeting - "Bhai/Behen, suno ek kahani..." (introduce topic warmly)
Scene 2 (9s): Problem - Explain {disease_name} using simple words
Scene 3 (9s): Farm Analogy - Compare to farm situation (crops, rain, animals, harvest)
Scene 4 (9s): Solution - What to eat/avoid (Indian village foods only)
Scene 5 (9s): Hope - Encouraging message "Theek ho jaoge, bas dhyan rakho"

FOR EACH SCENE PROVIDE:
- Visual: What animation shows (farm_field, sugar_bowl, weak_plant, healthy_plant, food_plate, farmer_happy, farmer_sad)
- Narration: Exact words to speak (in {lang_name})
- Animation: How visuals move (fade_in, grow, shrink, bounce, shake)

Return ONLY a valid JSON in this EXACT format:
{{
    "title": "Story title in {lang_name}",
    "duration": 45,
    "language": "{language}",
    "scenes": [
        {{
            "id": 1,
            "duration": 9,
            "visual": "farm_field",
            "narration": "Scene 1 narration in {lang_name}",
            "animation_type": "fade_in"
        }},
        {{
            "id": 2,
            "duration": 9,
            "visual": "sugar_bowl",
            "narration": "Scene 2 narration in {lang_name}",
            "animation_type": "grow"
        }},
        {{
            "id": 3,
            "duration": 9,
            "visual": "weak_plant",
            "narration": "Scene 3 narration in {lang_name}",
            "animation_type": "shake"
        }},
        {{
            "id": 4,
            "duration": 9,
            "visual": "food_plate",
            "narration": "Scene 4 narration in {lang_name}",
            "animation_type": "bounce"
        }},
        {{
            "id": 5,
            "duration": 9,
            "visual": "farmer_happy",
            "narration": "Scene 5 narration in {lang_name}",
            "animation_type": "fade_in"
        }}
    ]
}}

IMPORTANT: Return ONLY the JSON, no other text!"""

            # Call Ollama to generate story
            response = ollama.chat(
                model=self.model,
                messages=[{'role': 'user', 'content': prompt}]
            )
            
            story_text = response['message']['content']
            
            # Parse JSON from response
            try:
                # Try to extract JSON from markdown code blocks
                if '```json' in story_text:
                    json_start = story_text.index('```json') + 7
                    json_end = story_text.index('```', json_start)
                    story_text = story_text[json_start:json_end].strip()
                elif '```' in story_text:
                    json_start = story_text.index('```') + 3
                    json_end = story_text.index('```', json_start)
                    story_text = story_text[json_start:json_end].strip()
                
                story = json.loads(story_text)
                
                # Validate structure
                if 'scenes' not in story or len(story['scenes']) != 5:
                    raise ValueError("Invalid story structure")
                
                print(f"✅ Story video generated: {story['title']}")
                return story
                
            except Exception as e:
                print(f"⚠️ JSON parsing error: {str(e)}")
                # Fallback to template
                return self._create_template_story(disease_name, severity, language)
                
        except Exception as e:
            print(f"❌ Story generation error: {str(e)}")
            return self._create_template_story(disease_name if 'disease_name' in locals() else 'Health Issue', severity if 'severity' in locals() else 5, language)
    
    def _create_template_story(self, disease: str, severity: int, language: str) -> dict:
        """Create template story when AI generation fails"""
        
        templates = {
            "en": {
                "title": f"{disease} Story",
                "scenes": [
                    {"id": 1, "duration": 9, "visual": "farm_field", 
                     "narration": f"Friend, listen to a story about your health...", 
                     "animation_type": "fade_in"},
                    {"id": 2, "duration": 9, "visual": "sugar_bowl",
                     "narration": f"You have {disease}. Your body needs balance.",
                     "animation_type": "grow"},
                    {"id": 3, "duration": 9, "visual": "weak_plant",
                     "narration": "Like a crop that needs proper care and water.",
                     "animation_type": "shake"},
                    {"id": 4, "duration": 9, "visual": "food_plate",
                     "narration": "Eat: bajra, palak, dahi. Avoid: mithai, tel.",
                     "animation_type": "bounce"},
                    {"id": 5, "duration": 9, "visual": "farmer_happy",
                     "narration": "You will get better. Take care!",
                     "animation_type": "fade_in"}
                ]
            },
            "hi": {
                "title": f"{disease} की कहानी",
                "scenes": [
                    {"id": 1, "duration": 9, "visual": "farm_field",
                     "narration": "भाई, सुनो एक कहानी अपनी सेहत की...",
                     "animation_type": "fade_in"},
                    {"id": 2, "duration": 9, "visual": "sugar_bowl",
                     "narration": f"तुम्हें {disease} है। शरीर को संतुलन चाहिए।",
                     "animation_type": "grow"},
                    {"id": 3, "duration": 9, "visual": "weak_plant",
                     "narration": "जैसे फसल को पानी और देखभाल चाहिए।",
                     "animation_type": "shake"},
                    {"id": 4, "duration": 9, "visual": "food_plate",
                     "narration": "खाओ: बाजरा, पालक, दही। बचो: मिठाई, तेल।",
                     "animation_type": "bounce"},
                    {"id": 5, "duration": 9, "visual": "farmer_happy",
                     "narration": "ठीक हो जाओगे। ध्यान रखो!",
                     "animation_type": "fade_in"}
                ]
            }
        }
        
        template = templates.get(language, templates["en"])
        return {
            "title": template["title"],
            "duration": 45,
            "language": language,
            "scenes": template["scenes"]
        }
    
    def _fallback_story(self, diagnosis: dict, language: str) -> dict:
        """Fallback when Ollama is not available"""
        disease_name = "Health Issue"
        if diagnosis.get('diseases'):
            disease_name = diagnosis['diseases'][0].get('name', 'Health Issue')
        
        return self._create_template_story(disease_name, diagnosis.get('severity', 5), language)

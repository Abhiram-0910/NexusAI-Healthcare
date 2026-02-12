import os
import base64
try:
    from google.cloud import texttospeech
    GOOGLE_TTS_AVAILABLE = True
except ImportError:
    GOOGLE_TTS_AVAILABLE = False
    print("⚠️ google-cloud-texttospeech not installed")

class CloudTTSService:
    """Google Cloud Text-to-Speech service for high-quality multi-language voice"""
    
    def __init__(self):
        self.client = None
        
        if not GOOGLE_TTS_AVAILABLE:
            print("⚠️ Cloud TTS: Library not available, using fallback")
            return
            
        api_key = os.getenv("GEMINI_API_KEY")
        
        if api_key:
            try:
                # Google Cloud TTS requires service account or ADC
                # For Gemini API key, we'll use a workaround with gTTS instead
                # which is simpler and works with any Google API
                from gtts import gTTS
                self.use_gtts = True
                print("✅ Cloud TTS: Using gTTS (Google Text-to-Speech)")
            except ImportError:
                print("⚠️ Cloud TTS: gTTS not available, using browser fallback")
                self.use_gtts = False
        else:
            print("⚠️ Cloud TTS: No API key, using browser fallback")
            self.use_gtts = False
    
    def synthesize_speech(self, text: str, language_code: str = "en") -> dict:
        """
        Convert text to speech using gTTS
        
        Args:
            text: Text to convert to speech
            language_code: Language code (e.g., 'te-IN', 'hi-IN', 'en-IN')
            
        Returns:
            dict with audio_content (base64) and success status
        """
        if not hasattr(self, 'use_gtts') or not self.use_gtts:
            return {"success": False, "error": "TTS not available"}
        
        try:
            # Import gTTS
            from gtts import gTTS
            import io
            
            # Extract base language code (e.g., 'te' from 'te-IN')
            lang = language_code.split('-')[0]
            
            # gTTS language mapping
            lang_map = {
                'te': 'te',  # Telugu
                'hi': 'hi',  # Hindi
                'ta': 'ta',  # Tamil
                'kn': 'kn',  # Kannada
                'ml': 'ml',  # Malayalam
                'en': 'en',  # English
                'bn': 'bn',  # Bengali
                'gu': 'gu',  # Gujarati
                'mr': 'mr',  # Marathi
            }
            
            tts_lang = lang_map.get(lang, 'en')
            
            # Generate speech
            tts = gTTS(text=text, lang=tts_lang, slow=False)
            
            # Save to bytes buffer
            audio_buffer = io.BytesIO()
            tts.write_to_fp(audio_buffer)
            audio_buffer.seek(0)
            
            # Encode to base64
            audio_base64 = base64.b64encode(audio_buffer.read()).decode('utf-8')
            
            print(f"✅ gTTS: Synthesized {len(text)} chars in {tts_lang}")
            
            return {
                "success": True,
                "audio_content": audio_base64,
                "language": language_code,
                "voice_name": f"gTTS-{tts_lang}"
            }
            
        except Exception as e:
            print(f"❌ TTS Error: {e}")
            return {"success": False, "error": str(e)}

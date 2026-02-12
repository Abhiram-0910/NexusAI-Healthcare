@app.post("/api/analyze-report")
async def analyze_medical_report(
    file: UploadFile = File(...),
    language: str = Form("en")
):
    """
    Village Vaidya Report Reader - Analyze medical images/reports using Gemini Vision.
    Accepts: X-rays, blood reports, sugar reports, etc.
    Returns: Problems, severity, explanation, diet recommendations.
    """
    try:
        print(f"📸 Analyzing medical report in language: {language}")
        
        # Read image bytes
        contents = await file.read()
        print(f"📄 File received: {file.filename}, size: {len(contents)} bytes")
        
        # Analyze with Gemini Vision
        result = await vision_service.analyze_medical_report(contents, language)
        
        print(f"✅ Vision analysis complete: Severity {result.get('severity')}/10")
        
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
            "report_type": "Error",
            "explanation": f"Could not analyze report: {str(e)}",
            "severity": 0
        }

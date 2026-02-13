
import uvicorn
import os
import sys

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("🚀 Starting AI Healthcare Backend Server...")
    print("✅ Loading environment variables...")
    
    # Run Uvicorn server programmatically
    # This matches the behavior of 'uvicorn app.main:app --reload'
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

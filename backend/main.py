from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import json
import os
from mangum import Mangum  # Required for AWS Lambda deployment

app = FastAPI(
    title="AWS Cloud Comparator API",
    description="API to serve AWS service details for comparison",
    version="1.0.0"
)

# --- CORS Configuration ---
# This allows your React Frontend (localhost:5173) to talk to this Python Backend
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Robust Data Loading ---
def load_services():
    try:
        # This ensures we find the file even if you run the command from a different folder
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, "services_data.json")
        
        if not os.path.exists(file_path):
            print(f"Error: Database file not found at {file_path}")
            return []
        
        with open(file_path, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading data: {e}")
        return []

SERVICES_DB = load_services()

@app.get("/")
def root():
    return {"message": "AWS Comparator API is running."}

@app.get("/services")
def get_services(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    results = SERVICES_DB

    if category:
        results = [s for s in results if s["category"].lower() == category.lower()]
    
    if search:
        term = search.lower()
        results = [s for s in results if term in s["name"].lower() or term in s["description"].lower()]

    return {"count": len(results), "data": results}

@app.get("/services/{service_id}")
def get_service_detail(service_id: str):
    service = next((s for s in SERVICES_DB if s["id"] == service_id), None)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

handler = Mangum(app)
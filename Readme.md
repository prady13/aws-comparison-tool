# ☁️ AWS Cloud Services Comparison Tool

> A full-stack research engine designed to provide accurate, side-by-side comparisons of AWS services, their pricing models, and free tier limits.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Stack](https://img.shields.io/badge/Stack-FastAPI_React-blue)

## 📖 Overview
This project is a "Skeptical Researcher" tool built to cut through marketing fluff and compare AWS services based on hard data. It features a **Python FastAPI backend** (serving as a curated comparison engine) and a **React + TypeScript frontend** for the interactive UI.

### Key Features
- **Side-by-Side Comparison:** Compare up to 3 services (e.g., EC2 vs Lambda vs Fargate) on a single board.
- **Sticky Headers:** comparison tables designed for long feature lists.
- **Search & Filter:** Instantly filter services by category (Compute, Storage, Database) or keyword.
- **Dual-Mode Data:** Automatically falls back to a "Mock Mode" if the backend API is unreachable.

---

## 🛠 Tech Stack

### **Frontend (UI)**
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite (Blazing fast hot-reload)
- **Styling:** Tailwind CSS (Utility-first design)
- **Icons:** Lucide React

### **Backend (API)**
- **Framework:** FastAPI (High performance, auto-swagger docs)
- **Server:** Uvicorn (ASGI standard)
- **Deployment Ready:** Includes `Mangum` adapter for AWS Lambda deployment.
- **Data Source:** Local JSON (`services_data.json`) acting as a lightweight NoSQL store.

---

## 🚀 Getting Started

Follow these steps to run the full stack locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/prady13/aws-comparison-tool.git](https://github.com/prady13/aws-comparison-tool.git)
cd aws-comparison-tool

# Open a terminal and navigate to backend
cd backend

# Create a virtual environment (Mac/Linux)
python3 -m venv venv

# Activate the environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the Server
uvicorn main:app --reload

# Open a NEW terminal (keep the backend running)
cd frontend

# Install dependencies
npm install

# Start the UI
npm run dev

aws-comparison-tool/
├── backend/                 # Python API
│   ├── main.py             # FastAPI Server & Logic
│   ├── services_data.json  # The "Database"
│   └── requirements.txt    # Python Dependencies
├── frontend/               # React App
│   ├── src/
│   │   └── App.tsx         # Main UI Logic
│   ├── package.json        # Node Dependencies
│   └── tailwind.config.js  # Design System Config
└── README.md               # You are here



<img width="1440" height="900" alt="Screenshot 2025-11-20 at 9 44 43 PM" src="https://github.com/user-attachments/assets/0e45ee09-cd4f-47b9-8045-a1123d55955e" />


Deployed!


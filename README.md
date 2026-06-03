TalentRank is a modern, full-stack web application designed to revolutionize the recruitment pipeline by connecting top engineering talent with matching internships. Utilizing a custom automated skill-matching metric, the platform calculates exactly how well a candidate's profile aligns with technical job descriptions, providing clear tracking metrics for applicants and recruiters alike.

---

## 🛠️ Tech Stack

### Frontend
* **React (Vite)** – Modern component-driven, fast user interface development.
* **Tailwind CSS** – High-performance utility-first styling framework for a responsive layout.
* **React Router Dom** – Fluid client-side navigation and route management.

### Backend & Database
* **FastAPI (Python)** – Extremely high-performance, asynchronous REST framework.
* **PostgreSQL** – Relational database infrastructure for robust data schemas.
* **SQLAlchemy & Alembic** – Object-Relational Mapping (ORM) and efficient migration handling.

---

## ✨ Core Features

* **Real-Time Skill Matching Algorithm** – Dynamically parses and quantifies user-submitted technical skill sets against core backend internship requirements to render real-time match percentages.
* **Comprehensive Internship Posting Portal** – Custom recruiter UI featuring dedicated input forms to add internship parameters, dynamic tag builders for required skills, types, and remote configurations.
* **Interactive Job Board System** – Streamlined Candidate Marketplace with multi-parameter search capabilities and targeted filters.
* **Dynamic Hiring Pipeline Tracker** – End-to-end visual tracking pipeline utilizing status badges (`Hired`, `Keep Improving`, `Rejected`) alongside dynamic skill-match percentage indicators to keep applicants engaged.
* **Optimized Profile Media Uploads** – Clean handling of profile configurations, including custom asset storage via high-speed asynchronous payload endpoints.

---

## 📂 Project Structure

```text
TalentRank/
├── backend/            # FastAPI Python Server
│   ├── app/            # Main core application logic
│   ├── requirements.txt# Python package dependencies
│   └── .env            # Backend environment variables (Secret)
├── frontend/           # React Client App
│   ├── src/            # Components, Pages, and Context hooks
│   ├── package.json    # Frontend dependency tree
│   └── .env            # Frontend environment variables (Secret)
├── venv/               # Root Python Virtual Environment
└── .gitignore          # Full-stack global version control configuration
🚀 Local Installation & Setup
Follow these steps to spin up a local development instance of TalentRank.

📋 Prerequisites
Python 3.10+ installed globally.

Node.js (v18 or higher) and npm.

PostgreSQL running locally or via a cloud instancing tool (like Supabase/Aiven).

1. Database Setup
Create a new PostgreSQL database named talentrank on your local server system.

2. Backend Server Configuration
Navigate to the backend directory, initialize your dependencies, and configure environment paths:

Bash
# Navigate to backend folder
cd backend

# Create and activate virtual environment (if not already done at root)
python -m venv venv
# On Windows:
..\venv\Scripts\activate
# On Mac/Linux:
source ../venv/bin/activate

# Install requirements
pip install -r requirements.txt
Create a .env file inside the backend/ directory:

Code snippet
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/talentrank
SECRET_KEY=your_super_secret_jwt_and_session_key
Boot up the backend server:

Bash
uvicorn app.main:app --reload
The interactive Swagger API documentation will be viewable at: http://127.0.0.1:8000/docs

3. Frontend Client Configuration
Open a secondary terminal split slot, navigate to your frontend directory, and run the client-side server:

Bash
# Navigate to frontend folder
cd frontend

# Install modern Node dependencies
npm install
Create a .env file inside the frontend/ directory:

Code snippet
VITE_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
Boot up the development environment:

Bash
npm run dev
Open your browser to http://localhost:5173 to explore your running instance of TalentRank!

🔒 Security & Optimization Measures
Centralized Environmental Gatekeeping: Comprehensive root-level gitignores strictly isolate environment configurations (.env) and local build outputs to avoid exposing critical authentication systems.

Line-Ending Interoperability: Configured global workflow parameters ensuring automated formatting conversions between Unix (LF) and Windows (CRLF) platforms during commits.

📄 License
This project is open-source and available under the MIT License.

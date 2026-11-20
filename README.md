# ParcelTrack (parcel_track_mvp-)

Simple parcel registration, tracking, and arrival notification system for transport agencies in Cameroon (e.g., Douala ↔ Bamenda route).

---

## 1. Problem Statement
Inter-city transport agencies operating between major cities in Cameroon (such as Douala and Bamenda) frequently rely on manual paper ledgers and informal communications. This leads to:
- Difficulties tracking package handling across dispatch and arrival hubs.
- Lack of immediate visibility for senders and recipients.
- Notification delays when packages arrive at agency pickup counters.

## 2. Solution Summary
**ParcelTrack** is an MVP web application engineered to digitize parcel intake, generate distinct tracking IDs, provide real-time public parcel tracking, and notify recipients upon parcel arrival at the destination branch.

## 3. Planned MVP Features
- **Agency Staff Access**: Protected interface for branch operators.
- **Parcel Intake**: Registering parcels (sender details, recipient contact, route, package info).
- **Tracking ID Generation**: Generating unique tracking codes for each shipment.
- **Public Tracking Portal**: Lookup screen where clients query parcel progress.
- **Status Progression**: Managing lifecycle states (*Registered*, *In Transit*, *Arrived*, *Delivered*).
- **Arrival Notification**: Displaying/triggering arrival alerts for recipients.

## 4. Approved Stack
- **Frontend**: React, Vite, JavaScript, Tailwind CSS
- **Backend**: Python, FastAPI, Pydantic, SQLAlchemy
- **Database**: SQLite
- **Communication**: REST API (JSON)

## 5. Directory Structure
```
parceltrack-mvp/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── ui/
│   │   ├── layout/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── parcels/
│   │   │   └── tracking/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── styles/
│   └── README.md
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── docs/
│   ├── API_CONTRACT.md
│   ├── DATABASE_SCHEMA.md
│   └── DEMO_FLOW.md
├── .gitignore
├── README.md
└── LICENSE
```

## 6. How Services Will Eventually Run
*Note: Dependencies are not yet installed at this scaffolding stage.*

### Frontend (Future)
```bash
cd frontend
npm install
npm run dev
```

### Backend (Future)
```bash
cd backend
python -m venv .venv
# Activate environment (.venv\Scripts\activate on Windows)
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 7. Team Collaboration
Developed by a 5-member Buildathon team using Antigravity IDE and CLI, GitHub, and Stitch for UI designs.

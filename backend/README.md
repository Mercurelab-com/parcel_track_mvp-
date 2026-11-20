# Backend — ParcelTrack

## Purpose
The backend provides REST API services for ParcelTrack, built with **Python**, **FastAPI**, **Pydantic**, and **SQLAlchemy**.

## Responsibilities
- Handling parcel registration and status transitions.
- Generating distinct tracking identifiers.
- Serving public tracking inquiries.
- Managing arrival notifications.
- Interfacing with an **SQLite** database for persistent storage.

## Planned Modules
- `app/api/routes/`: Route controllers for parcels, tracking queries, and health status.
- `app/core/`: Application settings, environment configuration, and constants.
- `app/db/`: SQLAlchemy database engine and session factory.
- `app/models/`: Database ORM models.
- `app/schemas/`: Pydantic validation and serialization schemas.
- `app/services/`: Business logic operations (tracking ID creation, state updates).
- `app/main.py`: Main FastAPI application entry point.
- `tests/`: Automated unit and integration tests.

## Placeholder Setup
*Dependencies are not installed yet during the repository scaffolding stage.*

```bash
# Future setup:
python -m venv .venv
# On Windows: .venv\Scripts\activate
# On Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

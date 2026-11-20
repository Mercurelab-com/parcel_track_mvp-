# ParcelTrack Backend

FastAPI backend service for ParcelTrack — parcel registration and tracking system for transport agencies in Cameroon.

---

## 1. Prerequisites

- Python 3.10+ installed
- PowerShell (Windows) or terminal (macOS/Linux)

---

## 2. Setup & Virtual Environment

From the repository root, change to the `backend` directory:

```powershell
cd backend
```

Create a virtual environment (if not already created):

```powershell
python -m venv .venv
```

Activate the virtual environment:

- **Windows PowerShell**:
  ```powershell
  .\.venv\Scripts\Activate.ps1
  ```
  *(If execution policies restrict script activation, run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process` first)*

- **Windows Command Prompt (cmd)**:
  ```cmd
  .venv\Scripts\activate.bat
  ```

- **Linux / macOS**:
  ```bash
  source .venv/bin/activate
  ```

Install dependencies:

```powershell
pip install -r requirements.txt
```

---

## 3. Running the Development Server

From the `backend` directory with the virtual environment activated, start the server:

```powershell
uvicorn app.main:app --reload
```

The application runs at:
- **Base URL**: `http://localhost:8000`

---

## 4. Testing Endpoints

### Health Check Endpoint
Verify the server is running by opening in your browser or executing `curl`:

- **Browser**: [http://localhost:8000/health](http://localhost:8000/health)
- **Expected Response**:
  ```json
  {"status": "ok"}
  ```

### Interactive API Documentation
FastAPI provides automatic interactive Swagger documentation:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

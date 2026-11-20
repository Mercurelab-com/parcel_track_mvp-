# ParcelTrack — API Contract (MVP)

This document defines the formal REST API contract for the **ParcelTrack** Buildathon MVP. It serves as the single source of truth for communication between the React frontend and the FastAPI backend.

---

## 1. General API Information

- **Local Base URL**: `http://localhost:8000`
- **API Route Prefix**: `/api` (All application endpoints use this prefix, with the exception of `/health`)
- **Format**: JSON over HTTP (`Content-Type: application/json; charset=utf-8`)
- **Protocol**: RESTful HTTP methods (`GET`, `POST`, `PATCH`)

---

## 2. Parcel Lifecycle & Statuses

All parcel status values are strictly capitalized strings matching the following four enumeration states:

| Status Enum Value | Description / Meaning |
| :--- | :--- |
| `REGISTERED` | Parcel intake completed and recorded by agency staff at the origin branch. |
| `IN_TRANSIT` | Parcel has departed origin terminal and is en route to the destination agency. |
| `ARRIVED` | Parcel has reached the destination branch agency and is ready for customer pickup. |
| `COLLECTED` | Recipient has physically collected the parcel and confirmed handover. |

### Normal Transition Sequence

```
REGISTERED ──> IN_TRANSIT ──> ARRIVED ──> COLLECTED
```

> **Note**: For this Buildathon MVP, status transitions should strictly follow this forward progression. However, status validation will reject unknown status strings (`422 Unprocessable Entity`), while avoiding over-engineered state machine logic that could disrupt or block rapid demo presentations.

---

## 3. Tracking ID Specification

Tracking IDs are **system-generated** on the backend during parcel registration. The frontend **never** generates or dictates tracking IDs.

### Format Pattern
`PT-{CITY}-{HEX6}` (e.g., `PT-BAM-8F31A2`)

- **Prefix**: `PT` (Fixed acronym for ParcelTrack).
- **Destination City Code**: 3-character uppercase abbreviation representing the normalized destination (e.g., `BAM` for Bamenda, `DLA` for Douala, `YDE` for Yaoundé, `BAF` for Bafoussam).
- **Random Suffix**: 6 uppercase alphanumeric/hexadecimal characters generated using a secure random or pseudo-random generator.
- **Uniqueness**: Must be indexed and globally unique in the database.
- *Note*: `PT-BAM-8F31A2` is illustrative. The backend must generate unique IDs following this pattern dynamically.

---

## 4. Data Models & Schemas

### 4.1 Parcel Schema (Agency / Internal View)
All fields use `snake_case`:

| Field Name | Type | Constraints / Requirement | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Auto-increment | Internal database record ID |
| `tracking_id` | String | Unique, Indexed, System-generated | Public-facing tracking code |
| `sender_name` | String | Required, Min length 2 | Full name of sender |
| `sender_phone` | String | Required, Cameroon phone format | Contact telephone of sender |
| `recipient_name` | String | Required, Min length 2 | Full name of recipient |
| `recipient_phone` | String | Required, Cameroon phone format | Contact telephone of recipient |
| `origin` | String | Required | Origin city (e.g., `"Douala"`) |
| `destination` | String | Required | Destination city (e.g., `"Bamenda"`) |
| `description` | String | Required | Details of package contents/weight |
| `status` | String (Enum) | System-managed | Current status (`REGISTERED`, `IN_TRANSIT`, `ARRIVED`, `COLLECTED`) |
| `created_at` | String (ISO 8601) | System-generated | Timestamp when registered |
| `updated_at` | String (ISO 8601) | System-managed | Timestamp when last updated |
| `status_history` | Array[Object] | Ordered chronologically (ASC) | List of status history milestones |

### 4.2 Status History Schema
| Field Name | Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key | Unique history log record ID |
| `parcel_id` | Integer | Foreign Key (`parcels.id`) | Reference to parent parcel |
| `status` | String (Enum) | Required | Status at this milestone |
| `note` | String / Null | Optional | Context note (e.g., `"Dispatched on 10:00 AM express bus"`) |
| `timestamp` | String (ISO 8601) | System-generated | Event occurrence timestamp |

### 4.3 Public Tracking Schema (Privacy Safe)
To safeguard customer privacy, public inquiries via tracking ID **MUST NOT** expose telephone numbers:
- Excludes: `sender_phone`, `recipient_phone`, internal `id`.
- Includes: `tracking_id`, `sender_name`, `recipient_name`, `origin`, `destination`, `description`, `status`, `created_at`, `updated_at`, `status_history`.

---

## 5. API Endpoints

### Summary Matrix

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | Verify backend service availability |
| `POST` | `/api/parcels` | Agency / Demo | Register new parcel & create tracking code |
| `GET` | `/api/parcels` | Agency / Demo | List all parcels for staff dashboard |
| `GET` | `/api/parcels/{tracking_id}` | Public | Public tracking query (privacy-masked) |
| `PATCH` | `/api/parcels/{tracking_id}/status` | Agency / Demo | Advance parcel status & append milestone note |
| `GET` | `/api/parcels/stats/summary` | Agency / Demo | Aggregated status counts for dashboard |

---

### 5.1 Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Access**: Public
- **Purpose**: Liveness and health verification probe.

#### Response: `200 OK`
```json
{
  "status": "ok"
}
```

---

### 5.2 Register a Parcel
- **URL**: `/api/parcels`
- **Method**: `POST`
- **Access**: Agency / Demo Staff
- **Purpose**: Agency operator registers a newly received parcel at the desk.
- **Backend Lifecycle Actions**:
  1. Validate incoming payload fields.
  2. Normalize destination code and generate unique `tracking_id`.
  3. Initialize `status = "REGISTERED"`.
  4. Set `created_at` and `updated_at` timestamps (UTC).
  5. Automatically write the initial milestone into `parcel_status_history` (`status="REGISTERED"`, `note="Parcel registered at Douala agency"`).
  6. Return `201 Created` with the full parcel entity.

#### Request Body
```json
{
  "sender_name": "John Doe",
  "sender_phone": "677123456",
  "recipient_name": "Mary Jane",
  "recipient_phone": "690123456",
  "origin": "Douala",
  "destination": "Bamenda",
  "description": "Box of clothes"
}
```

#### Response: `201 Created`
```json
{
  "id": 1,
  "tracking_id": "PT-BAM-8F31A2",
  "sender_name": "John Doe",
  "sender_phone": "677123456",
  "recipient_name": "Mary Jane",
  "recipient_phone": "690123456",
  "origin": "Douala",
  "destination": "Bamenda",
  "description": "Box of clothes",
  "status": "REGISTERED",
  "created_at": "2026-11-20T10:00:00Z",
  "updated_at": "2026-11-20T10:00:00Z",
  "status_history": [
    {
      "id": 1,
      "parcel_id": 1,
      "status": "REGISTERED",
      "note": "Parcel registered at origin agency",
      "timestamp": "2026-11-20T10:00:00Z"
    }
  ]
}
```

---

### 5.3 List Parcels
- **URL**: `/api/parcels`
- **Method**: `GET`
- **Access**: Agency / Demo Staff
- **Purpose**: Populates the operator parcel inventory list and recent activity tables.
- **Query Parameters**: None required for initial MVP demo. Returns records sorted by `created_at` descending.

#### Response: `200 OK`
```json
[
  {
    "id": 1,
    "tracking_id": "PT-BAM-8F31A2",
    "sender_name": "John Doe",
    "sender_phone": "677123456",
    "recipient_name": "Mary Jane",
    "recipient_phone": "690123456",
    "origin": "Douala",
    "destination": "Bamenda",
    "description": "Box of clothes",
    "status": "REGISTERED",
    "created_at": "2026-11-20T10:00:00Z",
    "updated_at": "2026-11-20T10:00:00Z",
    "status_history": [
      {
        "id": 1,
        "parcel_id": 1,
        "status": "REGISTERED",
        "note": "Parcel registered at origin agency",
        "timestamp": "2026-11-20T10:00:00Z"
      }
    ]
  }
]
```

---

### 5.4 Track Parcel (Public Lookup)
- **URL**: `/api/parcels/{tracking_id}`
- **Method**: `GET`
- **Access**: Public (Unauthenticated)
- **Purpose**: Enables any sender or recipient to check parcel status and milestone history.
- **Privacy Rule**: Omits `sender_phone` and `recipient_phone`.

#### Successful Response: `200 OK`
```json
{
  "tracking_id": "PT-BAM-8F31A2",
  "sender_name": "John Doe",
  "recipient_name": "Mary Jane",
  "origin": "Douala",
  "destination": "Bamenda",
  "description": "Box of clothes",
  "status": "ARRIVED",
  "created_at": "2026-11-20T10:00:00Z",
  "updated_at": "2026-11-20T16:30:00Z",
  "status_history": [
    {
      "id": 1,
      "parcel_id": 1,
      "status": "REGISTERED",
      "note": "Parcel registered at Douala agency",
      "timestamp": "2026-11-20T10:00:00Z"
    },
    {
      "id": 2,
      "parcel_id": 1,
      "status": "IN_TRANSIT",
      "note": "Departed Douala terminal on express coach",
      "timestamp": "2026-11-20T11:30:00Z"
    },
    {
      "id": 3,
      "parcel_id": 1,
      "status": "ARRIVED",
      "note": "Parcel arrived at Bamenda agency — ready for pickup",
      "timestamp": "2026-11-20T16:30:00Z"
    }
  ]
}
```

#### Error Response: `404 Not Found`
Returned when `tracking_id` does not match any record in the database.
```json
{
  "detail": "Parcel with tracking ID PT-BAM-8F31A2 not found"
}
```

---

### 5.5 Update Parcel Status
- **URL**: `/api/parcels/{tracking_id}/status`
- **Method**: `PATCH`
- **Access**: Agency / Demo Staff
- **Purpose**: Agency staff transition parcel status along its journey.
- **Backend Lifecycle Actions**:
  1. Look up parcel by `tracking_id`. If non-existent, return `404 Not Found`.
  2. Validate `status` against accepted enum (`REGISTERED`, `IN_TRANSIT`, `ARRIVED`, `COLLECTED`).
  3. Update parcel `status` and set `updated_at = utcnow()`.
  4. Insert new record into `parcel_status_history` containing the new status, optional `note`, and current timestamp.
  5. Return `200 OK` with the full updated parcel object.

#### Request Body
```json
{
  "status": "ARRIVED",
  "note": "Parcel arrived at Bamenda agency"
}
```

#### Response: `200 OK`
```json
{
  "id": 1,
  "tracking_id": "PT-BAM-8F31A2",
  "sender_name": "John Doe",
  "sender_phone": "677123456",
  "recipient_name": "Mary Jane",
  "recipient_phone": "690123456",
  "origin": "Douala",
  "destination": "Bamenda",
  "description": "Box of clothes",
  "status": "ARRIVED",
  "created_at": "2026-11-20T10:00:00Z",
  "updated_at": "2026-11-20T16:30:00Z",
  "status_history": [
    {
      "id": 1,
      "parcel_id": 1,
      "status": "REGISTERED",
      "note": "Parcel registered at Douala agency",
      "timestamp": "2026-11-20T10:00:00Z"
    },
    {
      "id": 2,
      "parcel_id": 1,
      "status": "IN_TRANSIT",
      "note": "Departed Douala terminal on express coach",
      "timestamp": "2026-11-20T11:30:00Z"
    },
    {
      "id": 3,
      "parcel_id": 1,
      "status": "ARRIVED",
      "note": "Parcel arrived at Bamenda agency",
      "timestamp": "2026-11-20T16:30:00Z"
    }
  ]
}
```

---

### 5.6 Dashboard Summary Statistics
- **URL**: `/api/parcels/stats/summary`
- **Method**: `GET`
- **Access**: Agency / Demo Staff
- **Purpose**: Provides quick metrics for the agency overview dashboard cards.

#### Metric Definitions
- `total`: Total count of parcels ever registered in the system.
- `registered`: Parcels currently awaiting dispatch at origin branches.
- `in_transit`: Parcels currently moving on the road between cities.
- `arrived`: Parcels waiting at destination branches for customer collection.
- `collected`: Parcels that have completed their lifecycle and been picked up.

#### Response: `200 OK`
```json
{
  "total": 120,
  "registered": 15,
  "in_transit": 30,
  "arrived": 50,
  "collected": 25
}
```

---

## 6. Authentication & Security Scope

For this Buildathon MVP:
1. **Public Endpoints**:
   - `GET /health`
   - `GET /api/parcels/{tracking_id}`
2. **Agency Endpoints**:
   - `POST /api/parcels`
   - `GET /api/parcels`
   - `PATCH /api/parcels/{tracking_id}/status`
   - `GET /api/parcels/stats/summary`
3. **Demo Auth Mechanism**:
   - A demo login screen exists on the frontend (e.g., mock credentials `operator@parceltrack.cm` / `admin123`) to demonstrate role differentiation during the live presentation.
4. **Security Notice**:
   > **WARNING**: Backend routes currently do not enforce JWT or session tokens. This decision is deliberate to facilitate rapid frontend/backend parallel development and prevent demo-day authentication blockers. These endpoints must **not** be exposed to production networks without proper auth middleware.

---

## 7. Error Handling Standard

The API implements standard HTTP response codes and FastAPI's standard error payload structure: `{"detail": ...}`.

### 7.1 Validation Error (`422 Unprocessable Entity`)
Returned when required fields are missing, empty, or have invalid types.

```json
{
  "detail": [
    {
      "loc": ["body", "sender_phone"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 7.2 Resource Not Found (`404 Not Found`)
Returned when a requested `tracking_id` does not exist.

```json
{
  "detail": "Parcel with tracking ID PT-BAM-8F31A2 not found"
}
```

### 7.3 Internal Server Error (`500 Internal Server Error`)
Returned if an unexpected backend exception occurs.

```json
{
  "detail": "Internal server error"
}
```

---

## 8. CORS Configuration for Development

The FastAPI backend must configure CORS middleware to allow cross-origin requests from the React/Vite development server (default: `http://localhost:5173` or `http://127.0.0.1:5173`).

### FastAPI Implementation Guideline
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

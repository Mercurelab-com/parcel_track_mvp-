# ParcelTrack — Database Specification (SQLite / SQLAlchemy)

This document specifies the database design for the **ParcelTrack** Buildathon MVP. It details the SQLite physical schema, SQLAlchemy models, relationships, indexing strategies, and lifecycle data examples.

---

## 1. Storage & ORM Architecture

- **Engine**: SQLite 3 (`parceltrack.db`)
- **ORM**: SQLAlchemy (Declarative Base)
- **Rationale**: SQLite requires zero server administration, produces a single portable file, and provides instant setup for a five-developer team during rapid prototyping and live demonstrations.

```
+---------------------------------------+         +-----------------------------------------+
|                parcels                |         |          parcel_status_history          |
+---------------------------------------+         +-----------------------------------------+
| PK id                 INTEGER         |<---1---*| PK id                   INTEGER         |
| UI tracking_id        VARCHAR(30)     |         | FK parcel_id            INTEGER         |
|    sender_name        VARCHAR(100)    |         |    status               VARCHAR(20)     |
|    sender_phone       VARCHAR(20)     |         |    note                 TEXT / NULL     |
|    recipient_name     VARCHAR(100)    |         |    timestamp            DATETIME (UTC)  |
|    recipient_phone    VARCHAR(20)     |         +-----------------------------------------+
|    origin             VARCHAR(50)     |
|    destination        VARCHAR(50)     |
|    description        VARCHAR(255)    |
| IX status             VARCHAR(20)     |
|    created_at         DATETIME (UTC)  |
|    updated_at         DATETIME (UTC)  |
+---------------------------------------+
```

---

## 2. Table Definitions

For this MVP, exactly **two tables** are implemented. No additional entities (e.g., users, agencies, vehicles, payments) are included.

### 2.1 Table: `parcels`

Stores core parcel information, sender and recipient contacts, route endpoints, and current state.

| Column | Data Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | `NOT NULL` | Auto-increment | Primary key |
| `tracking_id` | `VARCHAR(30)` | `NOT NULL` | None | Unique public tracking code (e.g., `PT-BAM-8F31A2`) |
| `sender_name` | `VARCHAR(100)` | `NOT NULL` | None | Full name of the sender |
| `sender_phone` | `VARCHAR(20)` | `NOT NULL` | None | Telephone number of the sender |
| `recipient_name` | `VARCHAR(100)` | `NOT NULL` | None | Full name of the recipient |
| `recipient_phone` | `VARCHAR(20)` | `NOT NULL` | None | Telephone number of the recipient |
| `origin` | `VARCHAR(50)` | `NOT NULL` | None | Origin city or hub (e.g., `"Douala"`) |
| `destination` | `VARCHAR(50)` | `NOT NULL` | None | Destination city or hub (e.g., `"Bamenda"`) |
| `description` | `VARCHAR(255)` | `NOT NULL` | None | Brief description of package contents |
| `status` | `VARCHAR(20)` | `NOT NULL` | `'REGISTERED'` | Current status (`REGISTERED`, `IN_TRANSIT`, `ARRIVED`, `COLLECTED`) |
| `created_at` | `DATETIME` | `NOT NULL` | `utcnow` | UTC timestamp of parcel creation |
| `updated_at` | `DATETIME` | `NOT NULL` | `utcnow` | UTC timestamp of most recent status modification |

---

### 2.2 Table: `parcel_status_history`

Maintains the chronological audit trail of all milestone status changes for a parcel.

| Column | Data Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | `NOT NULL` | Auto-increment | Primary key |
| `parcel_id` | `INTEGER` | `NOT NULL` | None | Foreign key referencing `parcels.id` |
| `status` | `VARCHAR(20)` | `NOT NULL` | None | Status reached at this event |
| `note` | `TEXT` | `NULL` | None | Optional operational remark (e.g., `"Loaded on Bus 12"`) |
| `timestamp` | `DATETIME` | `NOT NULL` | `utcnow` | UTC timestamp when this status was recorded |

---

## 3. Relationships & Design Decisions

### 3.1 Relationship Architecture
- **One-to-Many**: One `parcels` row owns many `parcel_status_history` entries.
- **Cascade**: Deleting a parcel automatically cascades to delete all its associated history records (`cascade="all, delete-orphan"`).
- **Ordering**: History records are ordered chronologically ascending (`order_by="ParcelStatusHistory.timestamp.asc()"`).

### 3.2 Why a Separate Table Instead of Embedded JSON?
1. **Relational Integrity**: Foreign key constraints guarantee history records cannot be orphaned.
2. **Simple Querying in SQLite**: Standard SQL `JOIN` and `ORDER BY` operations work cleanly across all SQLite versions without requiring JSON extension functions (`json_each`, `json_extract`).
3. **Auditing & Append-Only Safety**: Status progression happens by inserting an immutable row rather than mutating a nested JSON document.
4. **Performance & Clean ORM Mapping**: SQLAlchemy automatically loads related records as native Python objects via relationship attributes.

---

## 4. SQLAlchemy Model Implementation Reference

Backend developers should implement models following this declarative layout:

```python
import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class ParcelStatus(str, enum.Enum):
    REGISTERED = "REGISTERED"
    IN_TRANSIT = "IN_TRANSIT"
    ARRIVED = "ARRIVED"
    COLLECTED = "COLLECTED"


class Parcel(Base):
    __tablename__ = "parcels"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tracking_id = Column(String(30), unique=True, index=True, nullable=False)
    sender_name = Column(String(100), nullable=False)
    sender_phone = Column(String(20), nullable=False)
    recipient_name = Column(String(100), nullable=False)
    recipient_phone = Column(String(20), nullable=False)
    origin = Column(String(50), nullable=False)
    destination = Column(String(50), nullable=False)
    description = Column(String(255), nullable=False)
    status = Column(
        String(20),
        default=ParcelStatus.REGISTERED.value,
        index=True,
        nullable=False,
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    # Relationship
    status_history = relationship(
        "ParcelStatusHistory",
        back_populates="parcel",
        cascade="all, delete-orphan",
        order_by="ParcelStatusHistory.timestamp.asc()",
    )


class ParcelStatusHistory(Base):
    __tablename__ = "parcel_status_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    parcel_id = Column(
        Integer,
        ForeignKey("parcels.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    status = Column(String(20), nullable=False)
    note = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Reverse relationship
    parcel = relationship("Parcel", back_populates="status_history")
```

---

## 5. Recommended Indexes

| Index Name | Table | Column(s) | Type | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `ix_parcels_tracking_id` | `parcels` | `tracking_id` | Unique | $O(1)$ lookup for public tracking queries |
| `ix_parcels_status` | `parcels` | `status` | Standard | High-speed filtering and stats aggregation |
| `ix_parcel_history_parcel_id` | `parcel_status_history` | `parcel_id` | Standard | Accelerated join queries when loading parcel history |
| `ix_parcel_history_timestamp` | `parcel_status_history` | `timestamp` | Standard | Fast chronological timeline rendering |

---

## 6. Timestamp Handling Guidelines

- **Storage**: All database datetime columns store timestamps in **UTC** (`datetime.utcnow`).
- **Serialization**: The FastAPI backend serializes datetimes to standard ISO 8601 strings (e.g., `2026-11-20T10:00:00Z`).
- **Frontend Display**: The React frontend parses ISO 8601 strings and formats them to Cameroon local time (**West Africa Time / UTC+1**), displaying human-readable formats such as `20 Nov 2026, 11:00 AM`.

---

## 7. Example Lifecycle Data

Below is an illustration of how records in both tables evolve for a parcel traveling from Douala to Bamenda:

### Table: `parcels` (Row at final state)
| id | tracking_id | sender_name | sender_phone | recipient_name | recipient_phone | origin | destination | description | status | created_at | updated_at |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `1` | `PT-BAM-8F31A2` | John Doe | 677123456 | Mary Jane | 690123456 | Douala | Bamenda | Box of clothes | `COLLECTED` | `2026-11-20 08:30:00` | `2026-11-20 18:00:00` |

### Table: `parcel_status_history` (Rows representing milestone audit logs)
| id | parcel_id | status | note | timestamp |
| :--- | :--- | :--- | :--- | :--- |
| `1` | `1` | `REGISTERED` | Parcel registered at Douala Akwa branch | `2026-11-20 08:30:00` |
| `2` | `1` | `IN_TRANSIT` | Loaded on morning express bus to Bamenda | `2026-11-20 09:45:00` |
| `3` | `1` | `ARRIVED` | Arrived at Bamenda Commercial Ave agency branch | `2026-11-20 16:15:00` |
| `4` | `1` | `COLLECTED` | Handed over to recipient Mary Jane | `2026-11-20 18:00:00` |

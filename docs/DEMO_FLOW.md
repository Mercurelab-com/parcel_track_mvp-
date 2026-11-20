# ParcelTrack — Buildathon Demo Flow & Presentation Script

This document details the live demonstration sequence, presentation script, realistic test scenarios, and fallback mitigation plan for the **ParcelTrack** Buildathon MVP.

---

## 1. Demo Scenario Overview

- **Route**: Douala (Akwa Branch) ➔ Bamenda (Commercial Avenue Branch)
- **Problem Context**: Inter-city transport agencies in Cameroon rely on paper registers. Recipients have no way of knowing when packages arrive without traveling to the agency or repeatedly calling busy desk agents.
- **Demo Objective**: Demonstrate zero-friction package intake, automated tracking ID generation, public tracking without login, and real-time arrival notifications.

### Realistic Demo Data
- **Sender**: `John Doe`
- **Sender Phone**: `677123456`
- **Recipient**: `Mary Jane`
- **Recipient Phone**: `690123456`
- **Origin**: `Douala`
- **Destination**: `Bamenda`
- **Description**: `Box of clothes`
- **Illustrative Tracking ID**: `PT-BAM-8F31A2` *(Generated dynamically by the backend, not hardcoded)*

---

## 2. Step-by-Step Demonstration Flow (14 Steps)

```
[Agency Portal: Register Parcel] ──> [Tracking ID: PT-BAM-8F31A2]
                                              │
                                              ▼
[Customer Tab: Search Tracking ID] <── [Public Tracking Screen]
                                              │
[Agency Tab: Update to IN_TRANSIT]            │
                                              ▼
[Agency Tab: Update to ARRIVED]    ──> [Customer Tab: Refresh] ──> [Ready for Pickup Alert!]
```

| Step # | User Action / Interface | Screen / Endpoint | Observed Result |
| :---: | :--- | :--- | :--- |
| **1** | Open Agency Login page | Frontend: `/login` | Staff enters demo credentials (`operator@parceltrack.cm`). |
| **2** | Enter Agency Dashboard | Frontend: `/dashboard` | Dashboard displays summary metric cards (Total, In Transit, Arrived). |
| **3** | Click "Register Parcel" button | Frontend: `/parcels/new` | Modal/Form appears with Cameroon phone placeholders (`6XXXXXXXX`). |
| **4** | Fill & submit parcel intake details | `POST /api/parcels` | Backend generates unique tracking ID (e.g., `PT-BAM-8F31A2`) and responds with `201 Created`. |
| **5** | Verify parcel in dashboard list | Frontend: `/dashboard` | Parcel appears at the top of the table with status badge `REGISTERED`. |
| **6** | Open customer tracking page | Frontend: `/tracking` | Separate browser tab or incognito window opens clean public tracking screen. |
| **7** | Enter tracking ID | Frontend input | Type `PT-BAM-8F31A2` and click **Track Parcel**. |
| **8** | View initial tracking timeline | `GET /api/parcels/PT-BAM-8F31A2` | Public screen shows route Douala ➔ Bamenda, status `REGISTERED`, and initial milestone. Point out: **Phone numbers are concealed for privacy**. |
| **9** | Return to Agency Dashboard tab | Frontend: `/dashboard` | Locate parcel `PT-BAM-8F31A2` and click **Update Status**. |
| **10** | Update to `IN_TRANSIT` | `PATCH /api/parcels/{id}/status` | Status changes to `IN_TRANSIT` with note: *"Departed Douala terminal on express coach"*. |
| **11** | Update to `ARRIVED` | `PATCH /api/parcels/{id}/status` | Status updates to `ARRIVED` with note: *"Parcel arrived at Bamenda agency — ready for pickup"*. |
| **12** | Return to Customer Tracking tab | Frontend: `/tracking` | Click refresh or click Track again. |
| **13** | Highlight arrival notification | Frontend display | Status badge is now `ARRIVED`. A prominent alert box appears: **"Ready for Collection at Bamenda Branch"**. |
| **14** | (Optional) Complete lifecycle | `PATCH /api/parcels/{id}/status` | Operator updates to `COLLECTED` when Mary Jane picks up the box. |

---

## 3. Presentation Narration Script

### Phase 1: Problem Statement (0:00 – 0:30)
> *"Good morning judges and fellow builders. In Cameroon, thousands of people send parcels every day between major hubs like Douala and Bamenda using inter-city bus agencies. But once a parcel is handed over, it enters a black box. Senders and recipients are left guessing whether the parcel is still on the road or sitting at the agency counter. They spend airtime calling busy agents or spend taxi fare visiting branches physically. Today, we built **ParcelTrack** to solve this."*

### Phase 2: Agency Parcel Intake (0:30 – 1:15)
> *"Let's see ParcelTrack in action. I am an agency operator at our Douala Akwa branch. John Doe walks in sending a box of clothes to Mary Jane in Bamenda. In less than 15 seconds, I register the parcel. Notice that our backend immediately assigns a unique tracking identifier: `PT-BAM-8F31A2`. The parcel is now safely registered in our database, with an automatic initial milestone record."*

### Phase 3: Public Customer Tracking (1:15 – 2:00)
> *"Now let's switch hats to the customer. Mary Jane in Bamenda doesn't need to create an account or install an app. She simply opens our public tracking page on her mobile phone and enters `PT-BAM-8F31A2`. Instantly, she sees the journey overview. Notice our privacy protection: sender and recipient phone numbers are never exposed publicly, while route details and package descriptions remain clear."*

### Phase 4: Real-time Arrival Alert & Collection (2:00 – 2:40)
> *"As the bus reaches Bamenda, the destination agent updates the status to `ARRIVED`. When Mary checks her tracking link, she immediately sees the prominent arrival alert with the pickup location instructions. Once she presents her identification at the counter, the agent marks it `COLLECTED`. Complete end-to-end visibility, with zero friction."*

### Phase 5: Conclusion & Future Roadmap (2:40 – 3:00)
> *"ParcelTrack transforms an archaic paper ledger system into a fast, transparent digital workflow using FastAPI, SQLite, and React. In our next iteration, we will add automated SMS and WhatsApp notifications upon parcel arrival. Thank you!"*

---

## 4. Presentation Timeline (3-Minute Target)

```
0:00 ── 0:30 [Problem Pitch: Black box in agency parcel delivery]
0:30 ── 1:15 [Agency Intake: Form submit & Tracking ID generation]
1:15 ── 2:00 [Customer Experience: Zero-login public tracking]
2:00 ── 2:40 [Status Update: IN_TRANSIT -> ARRIVED with pickup banner]
2:40 ── 3:00 [Wrap-up & Impact: Next steps & SMS integration]
```

---

## 5. Risk Mitigation & Fallback Plan

| Potential Issue | Root Cause | Immediate Backup Action |
| :--- | :--- | :--- |
| **API Connection Fails** | Local server stopped or port clash on `8000` | Start backend in a backup terminal; or switch frontend API client to pre-configured mock service mode. |
| **Database Lock / Corrupt DB** | Interrupted SQLite write | Delete `parceltrack.db` and execute the database init script to re-create clean tables with pre-seeded test data in 2 seconds. |
| **Frontend Rendering Glitch** | Browser caching or CSS issue | Demonstrate the live interactive Swagger documentation directly at `http://localhost:8000/docs`, executing registration, tracking, and status update endpoints live. |
| **Presenter Typo in Tracking ID** | Manual typing error during live talk | Pre-copy `PT-BAM-8F31A2` to the clipboard, or have a clickable "Use Demo Tracking ID" helper button on the tracking screen. |
| **Complete System Freeze** | Hardware / OS freeze | Fall back to pre-recorded 60-second video demo showing the exact 14-step flow. |

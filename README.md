# PashuMitra – From Farmer Reports to Early-Warning Action
### Livestock Disease Early-Detection & Surveillance Platform

> *"Multiple weak signals → one actionable risk signal"*

- **🌐 Live Production Deployment**: [https://client-wine-theta.vercel.app](https://client-wine-theta.vercel.app)
- **📦 GitHub Repository**: [https://github.com/adarshsingh022006-tech/pashumitra](https://github.com/adarshsingh022006-tech/pashumitra)

**PashuMitra** is a livestock disease early-detection and surveillance platform designed to bridge the critical gap between grassroots farmer symptom reports and rapid veterinary intervention. Built for mobile-first accessibility across rural India, it combines speech-to-text reporting in regional languages, offline-first data queues, an in-process Random Forest AI risk classifier, and spatial-temporal outbreak clustering (Haversine DBSCAN).

---

## 🌟 The PashuMitra Intelligence Loop

1. **CAPTURE (Grassroots Ingestion)**:
   - Voice dictation in English, Hindi (हिन्दी), and Punjabi (ਪੰਜਾਬੀ) powered by the browser Web Speech API with backend NLP keyword extraction.
   - 10 multi-select clinical symptom chips (fever, coughing, difficulty walking, salivation, loss of appetite, diarrhea, skin lesions, nasal discharge, lameness, swelling).
   - Herd registry, ante-mortem herd mortality reporting, and GPS geolocation auto-capture.
   - Offline-first resilience via Service Worker and IndexedDB queue with auto-sync when connectivity returns.

2. **ASSESS (AI-Assisted Risk Engine)**:
   - In-memory Random Forest risk classifier (`ml-random-forest`) trained at server startup on synthetic clinically plausible livestock disease profiles across 19 features.
   - Outputs risk category (**High**, **Medium**, **Low**), confidence metrics, and transparent, human-readable clinical rationale.
   - Clinically-calibrated rule-based fallback mechanism ensuring zero inference failures.
   - Human-in-the-loop governance: **"AI-assisted, vet-verified"**.

3. **CONNECT (Spatial-Temporal Epidemiological Fusion)**:
   - Haversine DBSCAN clustering algorithm grouping reports within a 5 km detection radius over a 14-day temporal window.
   - Live integration with OpenWeatherMap API for environmental context (temperature, humidity, wind) as vulnerability baselines.
   - Outbreak hotspot detection highlighting active transmission clusters (e.g. Ludhiana East Cluster: 28 reports, 7 high-risk).

4. **ACT (Early-Warning Veterinary Response)**:
   - Real-time Server-Sent Events (SSE) dispatching instant emergency alerts to licensed veterinarians.
   - Complete Case Lifecycle stepper: **New → Under Review → Visit Scheduled → In Treatment → Resolved**, with an emergency **Escalate Case** button.
   - Mobile clinical unit visit scheduling, prescription management, and state-level biosecurity advisories.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+ or v20+ / v24+)
- **npm** (v9+)

### 2. Install Dependencies
```bash
# In the project root:
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 3. Run Development Servers
Start both backend (`http://localhost:5000`) and frontend (`http://localhost:5173`) with a single command:
```bash
npm run dev
```

The server will automatically:
1. Initialize the SQLite database (`server/data/pashumitra.sqlite`).
2. Run database migrations and create indexed tables.
3. Seed demo users, herd animals, 39 historical health reports, and the Ludhiana outbreak cluster.
4. Train the Random Forest ML classifier in Node.
5. Launch the client on `http://localhost:5173`.

---

## 🔐 Demo Credentials

All test accounts use the password: `Demo@123`

| Role | Email | Password | Primary Workflow |
| :--- | :--- | :--- | :--- |
| **Farmer** | `farmer@demo.com` | `Demo@123` | Voice symptom reporting, herd health records, mortality alerts, offline sync |
| **Veterinarian** | `vet@demo.com` | `Demo@123` | Priority triage queue, AI verification, visit scheduling, treatment logs |
| **Government Authority** | `govt@demo.com` | `Demo@123` | State surveillance map, Recharts epidemiological curves, district matrix, BAHS 2025 mortality chart |

> **Pro-Tip**: You can also use the **1-Click Demo Evaluation Buttons** on the Login screen or the **DEMO ROLE SWITCH** buttons in the sidebar footer to switch roles instantly without logging out!

---

## 📊 Pre-Seeded Hackathon Scenarios

### 1. Case #0036 (Exact PPT Specimen)
- **Animal**: Cow, 21.0 years old (Tag `0036`, Sahiwal Indigenous)
- **Symptoms**: Fever, Difficulty Walking, Excessive Salivation
- **Vaccination**: Vaccinated
- **AI Classification**: **High Risk** (94% confidence)
- **Reason**: *"Presentation of acute pyrexia (fever) combined with excessive salivation and locomotor distress in cattle indicates high probability of vesicular disease / FMD episode within an active surveillance cluster."*
- **Status**: **Visit Scheduled** (Dr. Amritpal Singh assigned)

### 2. Ludhiana Outbreak Hotspot (Exact PPT Map Popup)
- **Coordinates**: 30.9010° N, 75.8572° E (Samrala / Ludhiana East)
- **Total Reports in Area**: 28
- **High-Risk Reports**: 7
- **Detection Radius**: 5 km
- **Map Visual**: Dashed red pulsing circle with detailed epidemiological popup.

### 3. Official Disease Mortality Statistics (BAHS 2025)
- **Source**: *Government of India, Department of Animal Husbandry & Dairying, Basic Animal Husbandry Statistics 2025*
- **Timeframe**: January – June 2024
- **Highlight Callout**: **51,848 Reported deaths from Ranikhet disease + IBD**
- **Data Points**:
  - Ranikhet Disease: 27,420
  - Infectious Bursal Disease (IBD): 24,428
  - African Swine Fever: 2,840
  - Peste des Petits Ruminants (PPR): 3,510
  - Fowl Pox: 1,230

---

## 🛠️ Tech Stack & Architecture

- **Frontend**:
  - React 18 + Vite
  - Tailwind CSS (Brand colors: Dark Green `#1B5E20`, Light Green `#7CB342`, Navy `#1F3A8A` / `#3B5BA5`, pastel cards)
  - React Router DOM v6 (role-based route guards)
  - Recharts (risk trends & official mortality bar chart)
  - react-leaflet & Leaflet (custom color-coded SVG risk pins & hotspot radius circles)
  - Lucide React icons
  - Web Speech API (speech recognition in English, Hindi, Punjabi)
  - Service Worker & IndexedDB offline queue

- **Backend**:
  - Node.js + Express
  - Knex Query Builder with SQLite fallback (PostgreSQL ready via `.env`)
  - JWT Authentication + bcryptjs
  - Zod request validation
  - Server-Sent Events (SSE) for live push alerts
  - OpenWeatherMap API proxy with caching & realistic environmental simulation

- **AI/ML Engine**:
  - `ml-random-forest` (`RandomForestClassifier`) + `ml-matrix`
  - 19-dimensional feature representation
  - Clinically-calibrated decision rule fallback engine

---

## 📡 Key REST API Endpoints

- `POST /api/auth/login` — JWT authentication
- `POST /api/auth/register` — Role-based registration
- `GET /api/reports` — Community & farmer health reports
- `POST /api/reports` — Submit report (triggers AI classification & notifications)
- `GET /api/reports/:id` — Full case details (with treatments, visits, weather)
- `PATCH /api/reports/:id/status` — Vet status change (Under Review → Visit Scheduled → In Treatment → Resolved)
- `POST /api/reports/:id/treatment` — Record diagnosis & prescription
- `POST /api/reports/:id/visit` — Schedule mobile clinic visit
- `POST /api/reports/:id/escalate` — Emergency case escalation
- `POST /api/reports/mortality` — Ante-mortem mortality reporting
- `GET /api/hotspots` — Active outbreak clusters (DBSCAN 5 km)
- `GET /api/notifications` — Notification inbox
- `GET /api/notifications/stream` — SSE live alert stream
- `POST /api/voice/parse` — Multilingual voice keyword extraction
- `GET /api/analytics/summary` — State surveillance KPIs
- `GET /api/analytics/trends` — 7-day risk trajectory curves
- `GET /api/analytics/mortality-stats` — GOI BAHS 2025 mortality data
- `GET /api/weather` — Real-time environmental temperature/humidity snapshot

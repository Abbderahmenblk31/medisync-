# 🏥 MediSync — Enterprise Clinic & Medical Practice Management SaaS

MediSync is a modern, HIPAA-compliant Medical Practice Management & Electronic Medical Records (EMR) system built with **Next.js 16 (App Router + Turbopack)**, **TypeScript**, and **Tailwind CSS**. It is designed with a pristine Day Mode (surgical luxury light mode) and high-contrast Night Mode.

---

## ✨ Core Clinical Capabilities

1. **🏥 Clinical Command Center (Dashboard):**
   - Real-time practice telemetry: Registered patients, daily appointments queue, waiting room occupancy, completed consultations, and daily revenue collection.
   - Live department occupancy tracking (Cardiology, General Medicine, Pediatrics, Dermatology, Orthopedics).

2. **📅 Smart Appointment Scheduling & Triage:**
   - Multi-criteria filtering by specialty department, appointment status (`SCHEDULED`, `CONFIRMED`, `IN_CONSULTATION`, `COMPLETED`, `CANCELLED`), and attending physician.
   - One-click patient status progression from reception check-in to consultation room.
   - Quick appointment booking modal with automatic duration and consultation fee assignment.

3. **👥 Electronic Medical Records (EMR) & Patient Registry:**
   - Comprehensive demographic, biological sex, and blood group directory.
   - **Critical Allergen Warning Engine**: Highlights severe drug contraindications (e.g. Penicillin, NSAIDs, Latex).
   - Interactive Patient Dossier modal displaying complete longitudinal consultation history, previous diagnoses, and vitals trend.

4. **🩺 Doctor's Clinical Charting Room:**
   - Real-time Vitals telemetry (Blood Pressure mmHg, Heart Rate bpm, Temperature °C, SpO2 %, Respiratory Rate, Weight, Height, and automatic BMI calculation).
   - ICD-10 diagnostic code selector and subjective/objective progress note documentation.
   - Pharmacy-grade Electronic Prescription (e-Rx) writer with dosage, frequency, and duration.
   - **Printable Medical Certificate & e-Prescription Slip**: Clean print-ready layout with physician credentials and license signatures.

5. **💳 Revenue Cycle & Medical Invoicing:**
   - Automated encounter billing generated upon consultation completion.
   - Direct copay & private billing tracking (`PAID`, `PENDING`, `INSURANCE_CLAIM`).
   - One-click receipt generation and point-of-sale settlement.

6. **🌗 Dual Theme Engine (Day & Night Mode):**
   - Pristine, high-clarity **Day Mode** (Light Mode) tailored for clinical monitors and bright hospital environments.
   - Deep slate **Night Mode** (Dark Mode) for on-call nocturnal shifts without screen glare.

---

## 🛠️ Architecture & Tech Stack

- **Framework:** Next.js 16 (App Router with Partial Prerendering & Cache Components)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 with custom CSS variables and print optimization media queries
- **State & Store:** In-memory clinical practice store with thread-safe atomic mutators (`clinic-store.ts`)
- **API Endpoints:**
  - `GET /api/analytics` — Practice KPIs and metrics
  - `GET /api/appointments` & `POST /api/appointments` — Appointment booking and query
  - `PATCH /api/appointments/:id` — Appointment status transitions
  - `GET /api/patients` & `POST /api/patients` — Patient intake and listing
  - `GET /api/patients/:id` — Patient dossier and clinical record history
  - `GET /api/records` & `POST /api/records` — Clinical charting & automatic billing
  - `GET /api/invoices` & `PATCH /api/invoices` — Billing and invoice settlements

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or 20.x+
- npm or pnpm

### 2. Installation & Setup
```bash
git clone https://github.com/Abbderahmenblk31/medisync.git
cd medisync
npm install
```

### 3. Run Development Server
```bash
npm run dev
# or on port 3003
npm run dev -- -p 3003
```

### 4. Build & Production Start
```bash
npm run build
npm run start -- -p 3003
```

Open [http://localhost:3003](http://localhost:3003) to access the clinic dashboard.

---

## 🛡️ License
Private Enterprise Software — Built for clinical workflow acceleration.

# AmanHeat GCC - Enterprise Heat-Safety & Labor-Welfare Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-emerald.svg)]()
[![Target Alignment](https://img.shields.io/badge/Qatar-Ministerial%20Decree%2017/2021-sky.svg)]()

**AmanHeat GCC** is a specialized, enterprise-grade Heat-Safety and Labor-Welfare software-as-a-service (SaaS) platform built for Qatar's oil & gas, industrial, and civil construction sectors under **Ministerial Decree No. 17 of 2021** and **Qatar National Vision 2030**.

---

## 🚀 Key Features

* **Dual-Tier Software Architecture:**
  * **Tier 1 (Oil & Gas Enterprise):** Software-only integration layer connecting directly to pre-installed ATEX/IECEx Zone 1 sensors (QuesTemp, Crowcon) via Modbus TCP (Port 502) and MQTT.
  * **Tier 2 (Civil & Ashghal Roads):** Full-stack Hardware-as-a-Service (HaaS) package comprising white-labeled IP68 smart bands, towable solar WBGT road trailers (asphalt heat bloom tracking), and 20ft container charging kiosks.
* **QatarEnergy Corporate & Contractor Dashboards:**
  * **Contractor Control Center:** Real-time zone shift matrix, 30/30 work-rest alerts, plant PA/LED signage triggers, and manual field entry forms.
  * **QatarEnergy Corporate Oversight Portal:** Macro-compliance scoring across contractors, risk heatmaps, and SHA-256 cryptographic audit logs.
* **Immutable Zero-Trust Audit Vault:** Every reading is hashed with SHA-256 timestamps for 1-click Ministry of Labour audit verification.

---

## 📁 Repository Directory Structure

```
AmanHeat-GCC/
├── index.html                           # Main Web App HTML Entry
├── package.json                         # Node.js Dependencies & Scripts
├── vite.config.js                       # Vite & Tailwind Development Config
├── src/                                 # React Dashboard Source Code
│   ├── main.jsx                         # React Root Mounting
│   ├── index.css                        # Tailwind CSS Styling
│   ├── App.jsx                          # Main Dashboard Navigation & State
│   ├── services/
│   │   └── atexIngestionEngine.js       # WBGT Math, Law Evaluation & SHA-256 Service
│   └── components/
│       ├── ContractorHseDashboard.jsx   # Contractor Control Center & Zone Management
│       ├── QatarEnergyOversightDashboard.jsx # Corporate Oversight & SHA-256 Audit Vault
│       ├── ManualDataEntryModal.jsx     # Manual Field Entry Form for HSE Officers
│       └── AtexBridgeCodeViewer.jsx     # Interactive Ingestion Driver Viewer
├── backend-drivers/                     # Python Hardware Ingestion Drivers & Simulators
│   ├── modbus_atex_simulator.py         # Modbus TCP Server Simulator (Port 5020)
│   ├── test_modbus_client.py            # Modbus Client Ingestion Test Script
│   └── atex_sensor_ingestion_bridge.py  # Production ATEX Sensor Bridge
└── docs/                                # Executive Pitch Decks & Proposals
    ├── QSTP_Application_Proposal.md     # QSTP Tech Incubator Application Proposal
    ├── QatarEnergy_ATEX_Enterprise_Platform_Proposal.md # O&G Enterprise Platform Specification
    └── ATEX_Sensor_Ingestion_Architecture.md # Modbus Register Maps & API Schemas
```

---

## 💻 Local Quickstart & Development

### 1. Run the Frontend Dashboard
```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev
```
Open `http://localhost:3000` in your browser.

### 2. Test the Local Modbus TCP ATEX Sensor Ingestion Engine
```bash
# In Terminal 1: Start local Modbus TCP ATEX Probe Simulator on Port 5020
python3 backend-drivers/modbus_atex_simulator.py

# In Terminal 2: Run client telemetry ingestion script
python3 backend-drivers/test_modbus_client.py
```

---

## 🌐 Live Cloud Deployment (Vercel / Netlify)

To deploy a live, shareable URL for QSTP evaluation:
1. Push this repository to GitHub.
2. Log into **[Vercel.com](https://vercel.com)** or **[Netlify.com](https://netlify.com)**.
3. Click **"Import GitHub Repository"** -> Select `AmanHeat-GCC`.
4. Click **Deploy** (Vercel automatically detects Vite). You will get a live URL like `https://amanheat-qatar.vercel.app`.

---

## 📄 License & Compliance

Developed for Qatar Science & Technology Park (QSTP) Incubation Application.  
Aligned with Qatar Ministerial Decree No. 17 of 2021.

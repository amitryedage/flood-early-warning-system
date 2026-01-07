# 🌊 Flood Early Warning System (FEWS)

> **Empowering Communities with Real-Time Data & Predictive Intelligence.**

## 📌 Project Overview
The Flood Early Warning System (FEWS) is a comprehensive platform designed to mitigate the impact of devastating floods. By bridging the gap between sophisticated environmental monitoring and community-level action, FEWS provides critical lead time for evacuations and resource deployment.

### ⚠️ The Problem
Flooding remains one of the most frequent and costly natural disasters globally. Current systems often suffer from:
- **Fragmented Data**: Information from various sensors and agencies is siloed.
- **Latency**: Alerts often reach the public after water levels have already breached critical thresholds.
- **Lack of Actionability**: Statistical data is hard for citizens to interpret into safe routes or immediate actions.

### 💡 Our Solution
FEWS integrates real-time sensor data, satellite imagery, and AI-driven predictions into a unified, multi-stakeholder interface:
- **The War Room (Admin)**: A command center for officials to monitor basins and manage responders.
- **The Responder App**: A mobile-optimized tool for emergency units to receive tasks and report ground truth.
- **Public Dashboard**: A user-friendly interface that translates complex data into simple safety status and evacuation guides.

---

## 🛠️ Google Tech Stack Integration
We leverage the power of **Google Cloud** and **Google Maps Platform** to provide world-class precision and reliability.

### 🌍 1. Microsoft Planetary Computer (Satellite Intel)
- **Problem Solved**: High-resolution historical analysis and current soil moisture/water body monitoring without API key restrictions.
- **Implementation**: We integrate the **Microsoft Planetary Computer STAC API** to fetch Sentinel-2 satellite imagery. By calculating the **NDWI (Normalized Difference Water Index)**, we identify real-time water body expansion and flood-prone zones, providing an extra layer of geospatial intelligence to our predictive models.

### 🗺️ 2. Google Maps Platform
- **Problem Solved**: Visualizing complex spatial data for rapid decision-making.
- **Implementation**:
    - **Advanced Markers**: Visualizing live sensor locations and responder units on a dynamic map.
    - **Geocoding API**: Translating user addresses into precise coordinates for localized alerts.
    - **Dynamic Styles**: Custom map styling to highlight river basins and critical infrastructure.

### 🧠 3. Vertex AI (Google Cloud)
- **Problem Solved**: Predicting water level breaches before they happen.
- **Implementation**: Our "Flood Prediction Engine" uses Vertex AI to process real-time rainfall data, upstream flow rates, and soil moisture (from GEE). This allows us to predict flash floods with higher accuracy than traditional threshold-based systems.

### ☁️ 4. Google Cloud Infrastructure
- **App Engine / Cloud Run**: For scalable, resilient backend services.
- **Cloud Pub/Sub**: To handle the high-throughput ingestion of IoT sensor data (simulated for MVP).

---

## 🚀 Key Features
- **Satellite Flood Mapping**: Real-time NDWI (water detection) heatmap overlay using Sentinel-2 L2A satellite data.
- **Real-Time Hydrology**: Live monitoring of water levels and rainfall intensity.
- **Predictive Analytics**: 24-hour visual forecast for potential flood breaches.
- **Citizen "Am I Safe?" Engine**: Instant safety assessment based on geolocation.
- **Resource Management**: Dynamic tasking and geo-tracking of emergency response units.

---

## 💻 Tech Implementation
- **Frontend**: React 19, Vite, Framer Motion, Tailwind CSS
- **Backend**: Node.js, Express, Socket.IO (for real-time heartbeats)
- **Database**: Supabase (PostgreSQL + Realtime)
- **State Management**: Custom React Hooks & Context API

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- Google Cloud Project with Billing Enabled
- API Keys for Google Maps and Geocoding

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/flood-early-warning-system.git
   cd flood-early-warning-system
   ```

2. **Install Dependencies**
   ```bash
   # Root
   npm install
   # Client
   cd client && npm install
   # Server
   cd ../server && npm install
   ```

3. **Configure Environment Variables**
   Create `.env` files in both `/client` and `/server` directories following the `.env.example` templates.

4. **Run the Application**
   ```bash
   # Run Backend (from /server)
   npm start
   # Run Frontend (from /client)
   npm run dev
   ```

---

## 📞 Support & Community
Join our mission to build more resilient communities. For technical issues, please open a GitHub Issue.

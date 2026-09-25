# 🍲 RESCUEFLOW
### Real-Time Surplus Food Rescue & Autonomous Redistribution Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-OpenStreetMap-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

---

## 💡 What is RESCUEFLOW? (In Simple Words)

Every day, restaurants, wedding halls, and supermarkets have **excess fresh, cooked food** at the end of the day. At the same time, nearby orphanages, homeless shelters, and community kitchens are **struggling to feed people**. 

Usually, this food gets thrown into the trash because:
1. Donors don't know who needs it nearby right now.
2. Nobody is available to pick it up and deliver it before it goes bad.

**RESCUEFLOW solves this problem like an "Uber + Swiggy for Food Donation":**
* A **Restaurant (Donor)** posts surplus meals in 30 seconds.
* The system instantly matches with the **nearest Shelter** that has hunger capacity.
* A **Driver / Volunteer** receives the pickup route, drives to collect the food, and delivers it with **live GPS tracking**.

---

## 🔄 How It Works (Step-by-Step)

```text
[ 1. DONOR POSTS FOOD ]
      │
      │ "We have 40 portions of fresh Biryani safe until 10:00 PM"
      ▼
[ 2. SMART SYSTEM MATCHING ]
      │
      │ Finds the closest verified Shelter with room to accept meals
      ▼
[ 3. SHELTER ACCEPTS ]
      │
      │ Shelter clicks "Accept Delivery"
      ▼
[ 4. DRIVER DISPATCH & LIVE GPS ]
      │
      │ Real road route calculated (e.g. 5.4 km, 12 min arrival)
      │ Live driver location updates on the map in real time
      ▼
[ 5. FOOD DELIVERED & IMPACT RECORDED ]
      │
      │ Meals rescued: +40  |  CO2 prevented: ~100 kg
```

---

## 👥 The 3 Portals (Who Uses This App?)

RESCUEFLOW has **3 completely separate portals**. When you log in, the app gives you a customized dashboard based on your role:

### 1. 🍽️ DONOR (Restaurants, Hotels, Caterers, Bakeries)
* **Post New Donation**: Enter food name, meal count (e.g., 50 meals), category (Veg/Non-Veg/Bakery), and expiry time.
* **Match with Shelters**: See nearby shelters ranked by need level and distance.
* **Live Delivery Tracking**: Watch the driver moving on a real map with actual road distance (km) and estimated arrival time (minutes).
* **Impact Tracker**: See total meals you saved and environmental carbon emissions prevented.

### 2. 🏠 SHELTER (NGOs, Orphanages, Community Kitchens, Old Age Homes)
* **Incoming Feed**: Get instant notifications whenever fresh food is donated nearby.
* **Capacity Control**: Set current bed/meal capacity so donors don't send more food than you can store or distribute.
* **Easy Location Picker**: Type your address or click directly on the map to set your shelter's exact GPS location.
* **Accept / Reject**: Choose which deliveries to receive with a single click.

### 3. 🚐 DRIVER (Volunteers & Fleet Delivery Partners)
* **Pickup Dispatch**: View active delivery requests with pickup address, shelter drop-off, and contact numbers.
* **Real-time Navigation**: Real road navigation with turn-by-turn road route polylines.
* **Live GPS Broadcast**: Shares location automatically with donor and shelter via WebSockets.
* **Simple Milestone Steps**:
  * Step 1: `PICKED_UP` (Collected food from restaurant)
  * Step 2: `ON_THE_WAY` (Driving to shelter)
  * Step 3: `DELIVERED` (Handover confirmed)

---

## ⭐ Cool Features That Make RESCUEFLOW Special

### 🗺️ 1. Real Road Navigation (Not Fake Straight Lines)
* Uses **Leaflet** with **OpenStreetMap** and the **OSRM Routing Engine**.
* Calculates the **real driving distance** along streets (e.g. `5.4 km`), not a fake straight line through buildings.
* Shows accurate **Estimated Arrival Time** (e.g. `12 min`).
* Auto-zooms and fits the map to show the entire driving route smoothly.

### ⏱️ 2. Freshness & Safety Expiry Clock
* Every donation has a safety expiry deadline (e.g., "Good for 3 hours").
* An automated background worker constantly monitors food safety to guarantee that no spoiled food is ever dispatched.

### 📍 3. Interactive "Locate Me" Button
* Uses your device's actual browser GPS (`navigator.geolocation`) to show a pulsing green **"You Are Here"** marker with an accuracy radius.

### 🎨 4. Neo-Brutalist Visual Design
* Modern, high-contrast visual design with bold borders, tactile drop shadows, and clean **Space Grotesk** typography that looks great on mobile, tablet, and desktop.

---

## 🚀 How to Run the Project (Simple 3-Step Setup)

You don't need any complex setup. Follow these simple steps in your terminal:

### Step 1: Clone the Project
```bash
git clone https://github.com/Yashwantsingh95/Amihacks-.git
cd Amihacks-
```

### Step 2: Install Dependencies
Open your terminal in the project folder and run:
```bash
# 1. Install frontend packages
npm install

# 2. Install backend packages
cd backend
npm install
cd ..
```

### Step 3: Start the App

**Terminal 1 (Backend Server):**
```bash
cd backend
npm start
```
> 💡 *Note: The backend automatically starts an in-memory MongoDB database if you don't have MongoDB installed. No database setup needed!*

**Terminal 2 (Frontend Client):**
```bash
npm run dev
```

Now open your browser and go to:
👉 **`http://localhost:5173`**

---

## 🧪 Testing the Live Tracking (Try it Yourself!)

1. Open `http://localhost:5173` and click **Get Started / Sign In**.
2. Log in as a **Donor** (or create a quick donor account).
3. On the Donor Dashboard, look for an active donation and click the black **"Track"** button.
4. You will see:
   * **Estimated Arrival** calculates real driving time (e.g. `4 min`).
   * **Road Distance** shows real driving distance (e.g. `2.3 km`).
   * **Interactive Map** draws the real road route connecting pickup and delivery.

---

## 🛠️ Tech Stack at a Glance

* **Frontend**: React 19, Vite, Leaflet, React-Leaflet, Lucide Icons, Socket.IO Client.
* **Backend**: Node.js, Express 5, Socket.IO, Axios.
* **Database**: MongoDB & Mongoose (with embedded in-memory mode for easy local testing).
* **Maps & Navigation**: OpenStreetMap tiles, OSRM Road Routing API, Nominatim Geocoding.
* **Auth**: Secure JWT tokens with Bcrypt password hashing.

---

## 📁 Key Files & Folders

* `src/pages/LiveTrackingPage.jsx` - Real-time GPS tracking screen with ETA, Road Distance, and Leaflet map.
* `src/components/ui/RealMap.jsx` - OpenStreetMap Leaflet component rendering pins, GPS circles, and road route polylines.
* `src/pages/DashboardPage.jsx` - Main Donor dashboard with donation list and Track buttons.
* `src/pages/ShelterDashboardPage.jsx` - Shelter interface for accepting incoming food and setting capacity.
* `src/pages/DriverDashboardPage.jsx` - Driver interface with active dispatches and status milestones.
* `backend/src/services/mapService.js` - Routing calculation engine calling OSRM for real turn-by-turn road routes.
* `backend/src/server.js` - Express backend and Socket.IO server.

---

## 📄 License
This project is open-source under the **ISC License**. Developed for AmiHacks 2026.

# RESCUEFLOW — Production Setup & Integration Guide

This guide provides step-by-step instructions to configure real services for **RESCUEFLOW**: Google OAuth 2.0, Google Maps Platform (Maps JS, Geocoding, Directions/Routes APIs), MongoDB Atlas, and production deployment.

---

## 1. Google Cloud Platform (GCP) Configuration

### Step 1.1: Create a Google Cloud Project
1. Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown at the top of the page and select **New Project**.
3. Set the Project Name: `RescueFlow-Production` (or your preferred name).
4. Click **Create** and ensure the project is selected in the top bar.

---

### Step 1.2: Enable Required APIs
In the Google Cloud Console, search for each API in the **APIs & Services > Library** and click **Enable**:
1. **Maps JavaScript API** — Required for interactive map rendering, custom markers, and real-time tracking views.
2. **Geocoding API** — Converts human-readable donor pickup addresses and shelter locations to exact `[longitude, latitude]` coordinates.
3. **Directions API** (or **Routes API**) — Calculates turn-by-turn road routes, distance polylines, and real-time ETAs between Driver, Donor, and Shelter.
4. **Places API (New)** *(Optional)* — Powers place autocomplete when donors search for pickup locations.

---

### Step 1.3: Create Google Maps Platform API Key
1. Go to **APIs & Services > Credentials**.
2. Click **+ Create Credentials** > **API Key**.
3. Click **Edit API Key** to secure it:
   - **Name**: `RescueFlow Maps Key`
   - **Application Restrictions**:
     - For **Frontend Development**: Select **Websites (HTTP referrers)** and add:
       - `http://localhost:5173/*`
       - `http://127.0.0.1:5173/*`
       - `https://your-production-domain.com/*`
   - **API Restrictions**:
     - Choose **Restrict key** and select:
       - *Maps JavaScript API*
       - *Geocoding API*
       - *Directions API*
4. Copy this key into your environment files:
   - Frontend: `VITE_GOOGLE_MAPS_API_KEY=<your_key_here>`
   - Backend: `GOOGLE_MAPS_API_KEY=<your_key_here>`

> **Note on Resilient Fallback:** If no Google Maps API key is configured, RESCUEFLOW automatically falls back to OpenStreetMap Nominatim for geocoding, OSRM for real road routing, and high-contrast Neo-Brutalist vector map projections. No crashes occur.

---

### Step 1.4: Configure Google OAuth 2.0 Credentials
1. Go to **APIs & Services > OAuth consent screen**:
   - User Type: Select **External** and click **Create**.
   - App Name: `RESCUEFLOW Food Rescue`
   - User Support Email: Your email address.
   - Developer Contact Email: Your email address.
   - Click **Save and Continue**.
   - Under **Scopes**, add: `.../auth/userinfo.email` and `.../auth/userinfo.profile`.
   - Complete the wizard and return to the dashboard.
2. Go to **APIs & Services > Credentials**:
   - Click **+ Create Credentials** > **OAuth client ID**.
   - Application Type: **Web application**.
   - Name: `RescueFlow Web Client`.
   - **Authorized JavaScript origins**:
     - `http://localhost:5173`
     - `http://localhost:5001`
     - `https://your-production-domain.com`
   - **Authorized redirect URIs**:
     - `http://localhost:5001/api/auth/google/callback`
     - `http://localhost:5173`
     - `https://api.your-production-domain.com/api/auth/google/callback`
3. Click **Create**.
4. Copy the generated **Client ID** and **Client Secret**:
   - Frontend: `VITE_GOOGLE_CLIENT_ID=<your_client_id>`
   - Backend: `GOOGLE_CLIENT_ID=<your_client_id>`
   - Backend: `GOOGLE_CLIENT_SECRET=<your_client_secret>`

---

## 2. MongoDB Database Configuration

### Option A: MongoDB Atlas (Recommended for Production)
1. Sign up or log in at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free shared cluster (e.g., `M0 Free Tier`).
3. Under **Security > Database Access**, create a user (e.g., `rescueflow_admin`) with password.
4. Under **Security > Network Access**, click **Add IP Address** and allow access from your deployment IP or `0.0.0.0/0` (with strong user credentials).
5. Under **Database > Connect**, select **Connect your application** (Driver: Node.js).
6. Copy the connection string:
   ```env
   MONGODB_URI=mongodb+srv://rescueflow_admin:<password>@cluster0.mongodb.net/rescueflow?retryWrites=true&w=majority
   ```

### Option B: Local / Development In-Memory Fallback
- If `MONGODB_URI` is left blank in development, the backend automatically boots an embedded in-memory MongoDB engine (`MongoMemoryServer`) and seeds realistic donors, shelters, drivers, and pending deliveries.

---

## 3. Environment Variable Reference

### Backend (`backend/.env`)
```bash
# Server Port & Environment
PORT=5001
NODE_ENV=development

# MongoDB Connection String (Leave blank for embedded in-memory DB)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/rescueflow?retryWrites=true&w=majority

# JWT Token Secret (Min 32 characters)
JWT_SECRET=super_secret_production_jwt_signing_key_replace_me

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# Allowed Frontend Origins (CORS & Socket.IO)
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173

# Google Maps Platform Server Key
GOOGLE_MAPS_API_KEY=AIzaSyYourServerGoogleMapsApiKey
MAPS_API_KEY=AIzaSyYourServerGoogleMapsApiKey

# Automatic Demo Seeding on Boot
SEED_DEMO=true
```

### Frontend (`.env` in Root)
```bash
# Backend API Base URL
VITE_API_URL=http://localhost:5001/api

# Google Maps JavaScript API Client Key
VITE_GOOGLE_MAPS_API_KEY=AIzaSyYourClientGoogleMapsApiKey

# Google Sign-In / OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## 4. Local Development

### 1. Install Dependencies
```bash
# Root frontend dependencies
npm install

# Backend dependencies
cd backend && npm install && cd ..
```

### 2. Start Services
Open two terminal windows:

**Terminal 1 (Backend API & WebSockets):**
```bash
cd backend
npm start
# Runs on http://localhost:5001
```

**Terminal 2 (Vite Frontend):**
```bash
npm run dev
# Runs on http://localhost:5173
```

---

## 5. Seed Test Credentials
When `SEED_DEMO=true` is enabled, the database is initialized with verified roles:

| Role | Email | Password | Coordinates | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Donor** | `donor@rescueflow.com` | `password123` | `28.6315, 77.2167` (CP) | ABC Restaurant |
| **Shelter** | `shelter@rescueflow.com` | `password123` | `28.6517, 77.1906` (Karol Bagh) | 120-capacity shelter |
| **Driver** | `driver@rescueflow.com` | `password123` | `28.6250, 77.2050` | Active volunteer driver |

---

## 6. Production Deployment

### Frontend (Vercel / Netlify / Cloudflare Pages)
1. Set the Build Command: `npm run build`
2. Set the Output Directory: `dist`
3. Configure Environment Variables:
   - `VITE_API_URL=https://api.yourdomain.com/api`
   - `VITE_GOOGLE_MAPS_API_KEY=AIzaSy...`
   - `VITE_GOOGLE_CLIENT_ID=...`

### Backend (Render / Railway / AWS ECS / DigitalOcean)
1. Set the Start Command: `cd backend && npm start`
2. Set Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5001`
   - `MONGODB_URI=mongodb+srv://...`
   - `JWT_SECRET=your_32_char_secret`
   - `FRONTEND_URL=https://yourdomain.com`
   - `GOOGLE_CLIENT_ID=...`
   - `GOOGLE_CLIENT_SECRET=...`
   - `GOOGLE_MAPS_API_KEY=...`
3. Ensure sticky sessions / WebSocket upgrade headers are permitted by the reverse proxy (Nginx / Cloudflare) for Socket.IO transport.

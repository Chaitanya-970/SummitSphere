# SummitSphere 🏔️

> India's community-driven trekking platform. Discover, plan, and explore the finest treks across the Himalayas.

**Live Demo:** [summitsphere-gamma.vercel.app](https://summitsphere-gamma.vercel.app)


## Overview

SummitSphere is a full-stack web application that connects trekkers with detailed information on 25+ verified Himalayan expeditions. Users can explore treks by state, difficulty, and altitude check live weather for any trail, view the route on an interactive map, read and write community reviews, book slots, and download a personalised field manual PDF.

Anyone with an account can also submit a trek they know. Submissions go into an admin moderation queue before going live on the platform.


## Features

### For Trekkers
- **Trek Discovery** — Browse and filter by state, difficulty, duration, altitude, and proximity using "Near Me"
- **Trail Weather** — Live 5-day forecast powered by OpenWeatherMap, specific to each trek's coordinates
- **Route Maps** — Day-by-day trail path on an interactive Leaflet map
- **Field Manual PDF** — Downloadable 5-page expedition guide covering itinerary, packing list, safety & medical info, and responsible trekking guidelines
- **Community Reviews** — Star ratings, written reviews, and photo attachments with full-screen lightbox viewer
- **Bookings** — Reserve a slot on any trek with email confirmation sent on booking
- **Saved Treks** — Bookmark treks to a personal radar for quick access later
- **Share** — Share any trek page directly via the native share sheet or clipboard copy

### For Contributors
- **Add a Trek** — Submit new treks with name, state, difficulty, description, photos, and an interactive map to plot the route
- **Edit Your Treks** — Update trek details and hero photos after submission

### For Admins
- **Command Centre** — Review pending bookings, approve or reject submitted treks, and moderate flagged reviews

### General
- **Dark Mode** — Full dark/light theme toggle, persisted across sessions
- **Responsive Design** — Fully optimised for mobile and desktop
- **Authentication** — JWT-based sign up, login, and password reset via email



## Tech Stack


| **Frontend** | React, Vite, Tailwind CSS |
| **Backend** | Node.js, Express |
| **Database** | MongoDB, Mongoose |
| **Auth** | JSON Web Tokens (JWT) |
| **Maps** | React Leaflet, OpenStreetMap |
| **Images** | Cloudinary |
| **Weather** | OpenWeatherMap API |
| **Email** | Brevo API |
| **PDF Generation** | jsPDF, jspdf-autotable |
| **Hosting** | Vercel (frontend), Render (backend) |



## Project Structure

```
summitsphere/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-level page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── context/       # Auth and dark mode context
│   └── public/            # Static assets
│
└── backend/           # Node.js + Express API
    ├── controllers/   # Route handler logic
    ├── models/        # Mongoose schemas
    ├── routes/        # Express route definitions
    ├── middleware/    # Auth, upload middleware
    └── utils/         # Email service, helpers
```



## Getting Started

### Prerequisites
- Node.js 
- MongoDB
- Cloudinary account (free tier)
- OpenWeatherMap API key (free)
- Brevo API key (free — 300 emails/day)

### Installation

```bash
# Clone
git clone https://github.com/Chaitanya-970/summitsphere.git
cd summitsphere

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Environment Variables

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

WEATHER_API_KEY=your_openweathermap_key

BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM_NAME=your_email_name
EMAIL_FROM_ADDRESS=your_email_address
FRONTEND_URL= your_vercel_frontend url
```

### Run Locally

```bash
# Terminal 1 — Backend
cd backend
npm start        # runs on port 5000

# Terminal 2 — Frontend
cd frontend
npm run dev      # runs on port 5173
```

Open [http://localhost:5173](http://localhost:5173)

---

## Seeding the Database

Register one account on the site first, then run:

```bash
cd backend
node seed.js
```

This populates 25 treks with full descriptions, images, itineraries, and sample reviews.

To wipe everything and start fresh:

```bash
node seed.js --force
```

> ⚠️ Running `seed.js` will clear all existing treks, bookmarks, bookings, and reviews.

---

## Deployment

**Frontend → Vercel**
- Connect your GitHub repo
- Set framework preset to **Vite**
- No additional config needed — Vite's SPA routing is handled automatically

**Backend → Render**
- Create a new Web Service pointing to the `backend/` folder
- Add all environment variables from `.env` in the Render dashboard
- Set `FRONTEND_URL` to your Vercel deployment URL

---

## Author

**Chaitanya Bhardwaj**

[GitHub](https://github.com/Chaitanya-970) · [LinkedIn](https://www.linkedin.com/in/chaitanya-bhardwaj-1a1a81372/)

---

*Built as a portfolio project. All trek data is curated for demonstration purposes.*
# SummitSphere 🏔️

**India's community-driven trekking platform.** Discover, plan, and explore the finest treks across the Himalayas — from beginner-friendly meadow walks to serious high-altitude expeditions.

Live at → [summitsphere-gamma.vercel.app](https://summitsphere-gamma.vercel.app)


## What it does

SummitSphere lets trekkers find detailed information on 25+ verified Himalayan treks, check live trail weather, read community reviews, book expeditions, and download a personalised field manual PDF for any trek — all for free.

Anyone can also submit a trek they know, which goes into a moderation queue before going live.


## Features

- **Trek Discovery** — Browse and filter treks by state, difficulty, duration, and altitude. Search by name or find treks near your current location.
- **Trail Weather** — Live 5-day weather forecast for each trek's exact coordinates, powered by OpenWeatherMap.
- **Route Map** — Interactive Leaflet map showing the day-by-day trail path for every trek.
- **Field Manual PDF** — Download a 5-page expedition guide for any trek covering the itinerary, packing list, safety & medical info, and responsible trekking guidelines.
- **Reviews & Photos** — Write reviews, attach photos, and rate treks. Photos open in a full-screen lightbox.
- **Bookings** — Reserve a slot on any trek. Booking confirmation is sent by email.
- **Saved Treks** — Bookmark treks to your personal radar for later.
- **Add a Trek** — Logged-in users can submit new treks by filling in details and plotting the route on an interactive map.
- **Dark Mode** — Full dark/light mode toggle, persisted across sessions.
- **Admin Dashboard** — Moderators can review incoming bookings, approve or reject new trek submissions, and moderate reported reviews.



## Getting Started (Local)

**Prerequisites:** Node.js, MongoDB (local or Atlas)

```bash
# Clone the repo
git clone https://github.com/Chaitanya-970/summitsphere.git
cd summitsphere

# Backend
cd backend
npm install
npm start

# Frontend
cd ../frontend
npm install
npm run dev
```


## Seeding the Database

After registering one account on the site, run the seeder to populate 25 treks and sample reviews:

```bash
cd backend
node seed.js
```



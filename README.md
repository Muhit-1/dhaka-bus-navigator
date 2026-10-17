# Dhaka Bus Navigator 🚌

A portfolio project: a bus-route and fare finder for Dhaka, Bangladesh. Built with React, Vite, and a small local Express + MySQL backend.

**Status:** work in progress, running locally only. Not deployed.

## 🚀 Features

- **Route Planning** - Find direct and one-transfer bus routes between two stops
- **Distance-based Fare Estimates** - ৳2.42/km, ৳10 minimum, rounded to the nearest ৳5
- **Interactive Map** - Leaflet + OpenStreetMap
- **Multi-language UI** - English and Bangla
- **Community Feedback Form** - Submits into the local database
- **Responsive, dark-mode-aware Design**

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, React Router
- **Map**: Leaflet.js with OpenStreetMap tiles
- **Backend**: Node/Express API (`server/`)
- **Database**: MySQL (tested against MySQL 8; MariaDB via XAMPP/WAMP should also work)

## 🔧 Setup Instructions

### Prerequisites
- Node.js 20+ (uses `node --env-file`, no `dotenv` dependency)
- A local MySQL server (XAMPP, WAMP, or a standalone MySQL install)

### Installation

1. **Clone the repository and install dependencies**
   ```bash
   git clone https://github.com/Muhit-1/dhaka-bus-navigator.git
   cd dhaka-bus-navigator
   npm install
   ```

2. **Configure the backend**
   ```bash
   cp server/.env.example server/.env
   ```
   Edit `server/.env` with your local MySQL credentials (`DB_USER`, `DB_PASSWORD`, etc.). The frontend needs no environment variables — in dev it talks to the API through a Vite proxy (`/api` → `http://localhost:5000`).

3. **Create and seed the database**
   ```bash
   npm run db:seed
   ```
   This creates the `dhaka_bus_navigator` database (see `server/schema.sql`) and, if `stops.txt`/`routes.txt` are present at the repo root, parses them and geocodes each stop via OpenStreetMap Nominatim (rate-limited, cached to `data/geocoded-stops.json` so re-runs don't re-hit the network). Those two `.txt` files aren't checked into the repo — ask the project owner for a copy, or point the parser at your own route data.

4. **Run the app** (frontend + backend together)
   ```bash
   npm run dev:all
   ```
   Or run them separately: `npm run server:dev` and `npm run dev`.

   The app is served at `http://localhost:3000`, the API at `http://localhost:5000`.

## 🗄️ Data notes

- Stop coordinates aren't hand-curated — they come from a best-effort OpenStreetMap geocode of each stop name. Expect some to be missing or approximate; the fare calculator falls back to the ৳10 minimum fare for any route where coordinates are unavailable.
- `routes.txt` (as sourced) only covers routes B–M; N–Z and numbered routes are not included.
- The `fares` table exists in the schema for manual per-segment overrides but isn't seeded — fares are computed client-side from stop coordinates.

## 📌 Known limitations

- No authentication — feedback submissions are anonymous, unrate-limited beyond basic length caps.
- Search is a simple direct/one-transfer lookup over in-memory data, not a real-time transit engine.
- Not yet deployed anywhere; this repo is meant to be run locally.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenStreetMap / Nominatim for map tiles and geocoding
- React and Vite teams for the tooling

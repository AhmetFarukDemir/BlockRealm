# ⛏️ BlockRealm RPG

A modern, full-stack incremental RPG built with React and Node.js. Gather resources, manage your inventory, craft gear, and trade in the marketplace.

Originally a frontend-only prototype, BlockRealm has been re-architected into a secure, database-driven web game focusing on server authority and scalable data management.

## 🚀 Tech Stack

**Frontend:**
* React 18 (Vite)
* TypeScript
* Zustand (State Management)
* Tailwind CSS & Framer Motion (Styling & UI)
* Clerk (Authentication)

**Backend & Database:**
* Node.js & Express
* MongoDB (Mongoose)
* Clerk Webhooks (User sync)

## 🧠 Architecture & Engineering

This project focuses on clean code principles and preventing common web-game exploits:

* **Server Authority:** The frontend never dictates game logic. Market prices, loot drops, and crafting costs are strictly calculated on the backend using a centralized `gameConfig.json` file to prevent client-side manipulation.
* **Buffered Synchronization:** To prevent server DDoS and race conditions during rapid clicking (Mining), actions are buffered locally in React using `useRef` and synced with the database every 2 seconds.
* **Two-Phase Commit Crafting:** Crafting logic ensures atomicity. The server verifies the user has all required materials and gold before executing any database modifications, preventing partial-crafting bugs.
* **O(1) Data Structuring:** The frontend transforms raw inventory arrays into Hash Maps (`Record<number, number>`) on the fly, allowing the UI to check crafting requirements and draw components instantly without nested loops.

## 🎮 Core Game Loops

1. **Surface Mine:** Gather raw materials (Stone, Iron Ore). Features a client-side Auto-Miner and real-time synchronization indicators.
2. **The Forge:** A dynamic crafting system. The UI checks inventory requirements in real-time and enables crafting if conditions (materials + gold) are met.
3. **Marketplace:** Sell gathered resources or buy items. Transactions are securely verified against the active game configuration.

## 🛠️ Quick Start

This repository uses a monorepo structure separating the `client` and `server`.

### 1. Backend Setup
```bash
# Navigate to the server folder
cd server

# Install dependencies
npm install

# Create a .env file based on your credentials
# Required: PORT, MONGO_URI, CLERK_WEBHOOK_SIGNING_SECRET
touch .env

# Start the server
npm start
```

### 2. Frontend Setup
Open a new terminal window:
```bash
# Navigate to the client folder
cd client

# Install dependencies
npm install

# Create a .env file
# Required: VITE_CLERK_PUBLISHABLE_KEY, VITE_API_URL (e.g., http://localhost:5000)
touch .env

# Start the development server
npm run dev
```

## 🔮 Roadmap

- [ ] **Automated Deployment:** [ ] CI/CD pipeline setup for automated deployment
- [ ] **Guest Access:** Implement "Continue as Guest" to allow instant gameplay without mandatory sign-up.
- [ ] **Combat System:** Introduction of the "Goblin Caves" with turn-based or real-time combat.
- [ ] **Advanced Loot Tables:** Complex drop logic for rare artifacts and boss encounters.
- [ ] **Equipment & Progression:** Implement active slots (Weapon, Armor, Accessory) with stat modifiers.

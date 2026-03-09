# ⛏️ BlockRealm RPG

A modern, web-based incremental RPG game built with React. Gather resources, manage your inventory, trade in the dynamic marketplace, and upgrade your gear. 

BlockRealm focuses on providing a seamless, state-driven gaming experience directly in the browser, featuring persistent data and smooth UI transitions.

## 🚀 Tech Stack & Architecture

This project was built focusing on **Engineering Excellence**, clean code principles, and modern frontend architecture:

* **Frontend Framework:** React 18 (Bootstrapped with Vite for instant HMR and optimized builds).
* **Language:** TypeScript (Strict typing for robust state and interfaces).
* **State Management:** Zustand (Implemented with `persist` middleware for LocalStorage data retention).
* **Routing:** React Router DOM v6 (Client-side routing with optimized component unmounting).
* **Styling:** Tailwind CSS (Utility-first, responsive, custom dark-theme configuration).
* **Animations:** Framer Motion (Smooth page transitions using `<AnimatePresence>`).

## 🧠 Core Features

* **Persistent Global State:** The game's core loop (Inventory, Gold, XP, Player Stats) is managed via a centralized Zustand store. Your progress is automatically saved to local storage—no data loss on refresh.
* **Data-Driven UI:** Components render conditionally based on strict data types (e.g., consumable items hide their level stats automatically).
* **Bulletproof Economy Logic:** The Marketplace implements strict array manipulation and security checks to prevent negative quantities or "infinite money" exploits.
* **Immutability:** State updates strictly follow React's immutability rules using spread operators and deep cloning to ensure flawless re-renders.

## 🎮 Game Loops (MVP)

1.  **Surface Mine:** Click to gather raw materials (Stone, Wood) and earn initial XP/Gold. Level up mechanics scale dynamically.
2.  **Marketplace:** Sell gathered resources based on dynamic values. Features "Sell 1" and "Sell All" batch processing.
3.  **Blacksmith (WIP):** Interface ready for upgrading gear and smelting raw ores into premium bars.
4.  **Goblin Caves (WIP):** High-risk, high-reward combat zone gated by player level.

## 🛠️ Quick Start

To run this project locally:

1. Clone the repository:
   ```Bash
   git clone [https://github.com/AhmetFarukDemir/blockrealm.git](https://github.com/AhmetFarukDemir/blockrealm.git)
   ```
2. Navigate to the project directory:
    ```Bash
    cd blockrealm
    ```
3. Install dependencies:
    ```Bash
    npm install
    ```
4. Start the development server:
    ```Bash
    npm run dev
    ```
🔮 Roadmap

    [ ] Supabase Integration for Cloud Saves & Authentication

    [ ] Implement Combat System for Goblin Caves

    [ ] Blacksmith logic for Pickaxe and Armor upgrading

    [ ] Dynamic loot tables and rarity calculations

Developed with a focus on clean frontend architecture.

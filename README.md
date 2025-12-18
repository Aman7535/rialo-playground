# ⚡ Rialo Playground: Event-Native Execution Engine

A **proof-of-concept** demonstrating Rialo's **event-driven blockchain architecture**, where real-world data triggers **deterministic on-chain logic** without oracle polling.

---

## 🧠 The Concept

Traditional blockchains rely on **polling oracles** to get external data, which introduces latency and complexity. **Rialo is event-native.**

This project simulates that architecture by fetching a **live BTC price stream** and feeding it into a local **Rule Engine**. Instead of passively reading data, the engine actively emits **semantic events** (like `VOLATILITY_SPIKE` or `MOMENTUM_UP`) based on **pre-defined logic rules**.

---

## ✨ Core Features

- **Zero Latency Simulation**  
  Toggle between **Rialo Mode** (Instant) and **Legacy Mode** (Simulated Oracle Delay).

- **Deterministic Logic**  
  Rules are **stateless** and implemented as **pure functions**.

- **Live Event Stream**  
  Visualizes the **"Mempool" → "Finality"** lifecycle.

---

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS (Cyberpunk / Dark Mode)
- **State:** In-Memory Event Store (No database required for demo)
- **Data Fetching:** SWR (Stale-While-Revalidate)
- **Icons:** Lucide React

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the repository
```
git clone https://github.com/Aman7535/rialo-playground.git
cd rialo-playground
```
2️⃣ Install dependencies
```
npm install
```
3️⃣ Run the development server
```
npm run dev
```
4️⃣ Open in browser

Navigate to:
👉 http://localhost:3000

---

##🎮 How to Use

Watch the Stream
The dashboard updates every 2 seconds with live simulated data.

Inject Events
Use the Pump or Crash buttons to force specific market conditions.

Toggle Modes
Switch to Legacy Mode to experience traditional oracle delays vs the speed of Rialo.

---

##📂 Project Structure
```
src/
├── app/
│   ├── api/events/      # The heartbeat (GET/POST logic)
│   └── page.tsx         # The Mission Control Dashboard
├── lib/
│   ├── eventStore.ts    # In-memory temporary database
│   ├── priceFetcher.ts  # External API handler
│   └── rules/           # The "Smart Contract" logic
```
---

## Built as a Proof-of-Concept for the Rialo Event-Native Architecture.

---

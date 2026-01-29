<div align="center">
  <img src="favicon.png" alt="Schduler Logo" width="120" height="120">
  <h1>🗓️ Scheduler</h1>
  <p><strong>Roster Management System</strong></p>

  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
</div>

---

## ✨ Key Features
- 🧠 **Intelligent Optimization**: Auto-generate optimized roster in seconds
- ⚙️ **Constraints Flexibilty**: Customize worker day-off and worker/post preferences
- 🖱️ **Drag-and-drop editor**: Instant interact with preview result
- 📤 **Easy Export**: Export finished rosters to **XLSX** (Excel) - ready for sharing
- 👥 **Multi-team Support**: Manage multiple teams under one account
- 🌙 **Dark Mode**: Eye-friendly dark theme perfect for calm planning

## 🏯 Architecture

This full-stack application follows a clean separation of concerns:

```
scheduler/
├── backend/           # FastAPI - Roster Engine
│   └── sch/
│       ├── routers/
│       └── services/
|       └── ...  
└── frontend/          # Next.js App - Dashboard & Interactions
    └── web/
        ├── app/
        └── ...
```

- **Frontend** (Next.js + TypeScript): Handles user interactions, previews, drag-and-drop editing, and UI rendering.
- **Backend** (FastAPI + Python): Powers the core roster optimization engine using Google OR-Tools constraint solver, API endpoints, and data processing.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

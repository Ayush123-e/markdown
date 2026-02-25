# 🎓 StudySpace

StudySpace is a modern, AI-powered EdTech web application designed to help students master video content in record time. It allows users to watch educational YouTube videos while seamlessly taking timestamp-synced rich text notes and interacting with a context-aware AI tutor built right into the workspace.

## ✨ Features

- **🎬 Video-Integrated Learning**: Paste a YouTube link and watch your video alongside your notes. No more alt-tabbing or losing your place.
- **📝 Timestamp-Synced Notes**: Take rich text notes (with formatting and links) that automatically sync with video timestamps. 
- **🤖 AI Tutor (Powered by Gemini)**: Stuck on a concept? Ask the built-in AI chatbot. It understands the context of your study session and provides plain-English answers to resolve doubts instantly.
- **🔐 Secure Authentication**: Full user authentication system powered by secure JSON Web Tokens (JWT).
- **💾 Auto-Saving & Downloading**: Your sessions are automatically saved to your private dashboard. You can also export your notes as HTML files.
- **🎨 Premium UI/UX**: A highly aesthetic, asymmetric, dark-emerald themed interface designed for focus and modern web standards.

---

## 🛠️ Tech Stack

This project is built using the robust **MERN Stack** (modified with PostgreSQL via Prisma) and modern integrations.

### Frontend
- **React.js** (Vite) - Component-based UI rendering
- **Vanilla CSS** - Custom, clean, utility-free styling for maximum control
- **React Router v6** - Client-side page routing
- **React-Quill-New** - Rich text editor for study notes
- **React-Player** - Unified video player component
- **React-Markdown** - For rendering formatted AI chatbot responses
- **Axios** - For making requests to the backend API

### Backend
- **Node.js & Express.js** - Fast, unopinionated backend web framework
- **PostgreSQL** - Relational database for structured data storage
- **Prisma ORM** - Next-generation Node.js and TypeScript ORM for safe database queries
- **JSON Web Tokens (JWT)** - For secure, stateless user authentication and authorization
- **Google Generative AI (Gemini)** - LLM integration via `gemini-flash-latest` for the AI Tutor feature
- **Bcrypt** - Password hashing for secure user credential storage
- **Cors & dotenv** - Cross-origin resource sharing and environment variable management

---

## 📂 Folder Structure

A clean, modular architecture separating the client side and the server side.

```text
StudySpace/
├── frontend/                 # React frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── api.js            # Axios instance with JWT interceptors
│   │   ├── App.jsx           # Main App routing logic
│   │   ├── index.css         # Global design tokens and base styles
│   │   ├── main.jsx          # React DOM entry point
│   │   └── pages/            # View components and distinct stylesheets
│   │       ├── Dashboard.jsx
│   │       ├── Dashboard.css
│   │       ├── LandingPage.jsx
│   │       ├── LandingPage.css
│   │       ├── Login.jsx
│   │       ├── Login.css
│   │       ├── Register.jsx
│   │       ├── Register.css
│   │       ├── SessionWorkspace.jsx
│   │       └── SessionWorkspace.css
│   └── package.json
│
├── backend/                  # Node.js/Express backend server
│   ├── prisma/
│   │   └── schema.prisma     # Postgres database schema definition
│   ├── src/
│   │   ├── controllers/      # Route logic handlers
│   │   │   ├── ai.controller.js      # Gemini Chatbot & high-load retry logic
│   │   │   ├── authController.js     # JWT Login/Register/Validation
│   │   │   └── session.controller.js # CRUD for Study Sessions
│   │   ├── middleware/       
│   │   │   └── authMiddleware.js     # Verifies JWTs on protected routes
│   │   ├── routes/           # API Endpoint definitions
│   │   │   ├── aiRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   └── sessionRoutes.js
│   │   └── index.js          # Express app setup and server initialization
│   ├── .env                  # Environment Variables (DB URL, API Keys)
│   └── package.json
│
└── README.md                 # Project documentation (You are here!)
```

---

## 🚀 Getting Started

To run this project locally, you will need Node.js installed on your machine along with a PostgreSQL database instance and a Google AI API Key.

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd StudySpace
```

### 2. Set up the Backend
```bash
cd backend
npm install

# Set up your .env file
# Create a .env file based on the required variables:
# DATABASE_URL="postgresql://user:pass@localhost:5432/studyspace"
# DIRECT_URL="postgresql://user:pass@localhost:5432/studyspace"
# JWT_SECRET="your_secure_random_string"
# GEMINI_API_KEY="your_google_ai_key"

# Sync the database schema
npx prisma db push

# Start the dev server (Runs on port 5000 by default)
npm run dev
```

### 3. Set up the Frontend
```bash
# In a new terminal tab
cd frontend
npm install

# Start the Vite development sever
npm run dev
```

### 4. Open the App
Navigate to `http://localhost:5173` in your browser.

---

> Designed & Developed as a premium, modern EdTech learning workspace.

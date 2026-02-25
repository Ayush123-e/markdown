# 📚 StudySync – AI-Powered Study Session Manager

A full-stack MERN web application that lets users create and manage study sessions with YouTube video integration and an AI-powered chat assistant (Google Gemini).

---

## 🚀 Live Demo

> Run locally by following the setup instructions below.

---

## 🧠 Project Overview

StudySync allows authenticated users to:
- Create study sessions linked to a **YouTube video URL**
- Write and save **rich-text notes** inside each session
- Chat with a **Google Gemini AI assistant** for help understanding topics
- Manage all sessions from a **personal dashboard**

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React (Vite) | UI framework |
| React Router DOM | Client-side routing & protected routes |
| Vanilla CSS | Custom styling |
| Axios | HTTP client for API calls |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| Prisma ORM | Database queries & schema management |
| PostgreSQL | Relational database |
| JSON Web Token (JWT) | Authentication & authorization |
| bcryptjs | Password hashing |
| Google Generative AI SDK | Gemini AI chat integration |
| dotenv | Environment variable management |
| CORS | Cross-origin request handling |

---

## 🗂️ Project Structure

```
new_project_mern/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database models (User, StudySession)
│   └── src/
│       ├── controllers/
│       │   ├── authController.js  # Register, Login, GetMe
│       │   ├── session.controller.js  # CRUD for study sessions
│       │   └── ai.controller.js   # Gemini AI chat handler
│       ├── middleware/
│       │   └── authMiddleware.js  # JWT verification middleware
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── session.routes.js
│       │   └── ai.routes.js
│       └── index.js               # Express app entry point
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── LandingPage.jsx    # Public home page
        │   ├── Register.jsx       # User registration
        │   ├── Login.jsx          # User login
        │   ├── Dashboard.jsx      # Session list & management
        │   └── SessionWorkspace.jsx  # Video + notes + AI chat
        ├── components/
        │   └── PrivateRoute.jsx   # Protected route wrapper
        ├── api.js                 # Axios instance with base URL
        └── App.jsx                # Route definitions
```

---

## 🔐 Authentication Flow

1. User registers → password is **hashed with bcryptjs** before storing in DB
2. On login → credentials verified → **JWT token generated** (expires in 30 days)
3. Token stored in **localStorage** on the client
4. Protected routes use `PrivateRoute` component – redirects unauthenticated users to `/login`
5. Backend routes use `authMiddleware` – verifies JWT on every protected API call

---

## 🗃️ Database Schema (Prisma + PostgreSQL)

```prisma
model User {
  id        String         @id @default(uuid())
  email     String         @unique
  password  String
  name      String?
  sessions  StudySession[]
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
}

model StudySession {
  id        String   @id @default(uuid())
  title     String
  videoUrl  String
  thumbnail String?
  content   String?  // Stores Rich Text HTML
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Create new user account | ❌ |
| POST | `/login` | Login & receive JWT token | ❌ |
| GET | `/me` | Get current logged-in user | ✅ |

### Session Routes — `/api/sessions`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create a new study session | ✅ |
| GET | `/` | Get all sessions for logged-in user | ✅ |
| GET | `/:id` | Get a single session by ID | ✅ |
| PUT | `/:id` | Update session title/content | ✅ |
| DELETE | `/:id` | Delete a session | ✅ |

### AI Routes — `/api/ai`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/chat` | Send message to Gemini AI with chat history | ✅ |

---

## ✨ Key Features

- **User Authentication** – Secure register/login with JWT & bcrypt
- **Study Session CRUD** – Create, view, update, delete study sessions
- **YouTube Integration** – Embed any YouTube video inside a session workspace
- **Rich Text Notes** – Write and save formatted notes per session
- **AI Chat Assistant** – Ask questions to Google Gemini AI within the session
- **Protected Routes** – Unauthenticated users are redirected automatically
- **Responsive Design** – Clean dark-themed UI built with Vanilla CSS

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- PostgreSQL database (or Supabase)
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/Ayush123-e/markdown.git
cd new_project_mern
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
DIRECT_URL=your_direct_postgresql_url
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Run Prisma migrations and start server:
```bash
npx prisma migrate dev
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Open in browser
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## 🏗️ Architecture Diagram

```
[User Browser]
     │
     ▼
[React Frontend - Vite]
  ├── LandingPage
  ├── Register / Login (JWT stored in localStorage)
  ├── Dashboard (fetch all sessions)
  └── SessionWorkspace
        ├── YouTube Video Player
        ├── Rich Text Notes Editor
        └── Gemini AI Chat
           │
           ▼
[Express.js Backend - Node.js]
  ├── Auth Middleware (JWT verification)
  ├── Auth Controller (register/login)
  ├── Session Controller (CRUD)
  └── AI Controller (Gemini SDK)
           │
           ▼
[PostgreSQL Database via Prisma ORM]
  ├── User table
  └── StudySession table
```

---

## 🔑 Design Decisions & Highlights

| Decision | Reason |
|----------|--------|
| **Prisma ORM** instead of Mongoose | PostgreSQL is relational; Prisma provides type-safety and clean schema management |
| **JWT in localStorage** | Simple stateless auth; easy to implement for SPA |
| **Google Gemini AI** | Free tier available; multi-turn chat history support |
| **Vite** for frontend | Faster dev server and build compared to CRA |
| **PrivateRoute component** | Centralized auth guard — reusable for any protected page |

---

## 👨‍💻 Author

**Ayush Kumar**  
GitHub: [@Ayush123-e](https://github.com/Ayush123-e)

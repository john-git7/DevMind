# Contributing to DevMind

Thank you for your interest in contributing to DevMind! We welcome contributions from the community to help make codebases faster and easier to understand.

---

## 🛠️ Development Setup

### Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **MongoDB**: MongoDB Atlas cluster with Vector Search configured (or local instance)
- **Gemini API Key**: Google AI Studio API key

### 1. Clone the repository
```bash
git clone https://github.com/john-git7/DevMind.git
cd DevMind
```

### 2. Configure Environment Variables
Copy `.env.example` in both server and client:

```bash
# Server configuration
cp server/.env.example server/.env

# Client configuration
cp client/.env.example client/.env
```

Ensure `GEMINI_KEY` and `MONGO_URI` are properly set in `server/.env`.

### 3. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Run Development Servers
```bash
# Terminal 1: Backend API (port 5001)
cd server
npm run dev

# Terminal 2: Frontend Client (port 5173)
cd client
npm run dev
```

---

## 🧪 Running Tests & Quality Checks

We use **Jest** and **Supertest** with an in-memory MongoDB server for testing.

```bash
# Run server test suite
cd server
npm test

# Run TypeScript typechecks
npm run build
```

---

## 📐 Project Structure

```
DevMind/
├── client/                 # React 18 + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI modals & chat messages
│   │   ├── hooks/          # Custom state & streaming hooks
│   │   ├── pages/          # ChatApp, Home, Login, Signup pages
│   │   └── context/        # Auth and global application context
│   └── ...
├── server/                 # Express + TypeScript + Mongoose backend
│   ├── controllers/        # Route business logic handlers
│   ├── middleware/         # Auth, Zod validation, Sentry error handlers
│   ├── models/             # Mongoose schemas (User, Chunk, RepoStatus, etc.)
│   ├── routes/             # REST endpoint routing
│   ├── schemas/            # Zod request validation schemas
│   ├── services/           # Indexer, Retriever, AST parser, Usage tracker
│   ├── tests/              # Jest + Supertest integration tests
│   └── utils/              # Crypto, Gemini API client, Retry mechanisms
└── ...
```

---

## 📜 Pull Request Guidelines

1. Create a feature branch (`git checkout -b feat/my-feature`).
2. Adhere to TypeScript strict typing (avoid `any` where possible).
3. Ensure all validation schemas are defined with Zod under `server/schemas/`.
4. Run `npm test` and ensure all tests pass before opening a PR.
5. Commit with clear, conventional commit messages (`feat:`, `fix:`, `refactor:`, `docs:`).

---

## ⚖️ License
DevMind is open-source software licensed under the [MIT License](LICENSE).

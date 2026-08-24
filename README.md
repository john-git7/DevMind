# DevGrasp

> **AI-Powered Codebase Intelligence & Developer Assistant** — Ask questions about complex repositories, trace bugs with AST context, review pull requests, and explore codebases with grounded AI citations.

---

## Overview

**DevGrasp** is a production-grade full-stack application built with TypeScript, React 18, Express, MongoDB Atlas Vector Search, and Google Gemini. It parses, indexes, and understands GitHub repositories to provide:

- **Codebase Chat with SSE Streaming**: Low-latency token-by-token streaming responses grounded in your repository's AST-extracted code chunks.
- **Bug Trace & Root-Cause Analysis**: Deep semantic search across function scopes and dependencies to pinpoint regressions.
- **Automated PR Reviews**: Summarizes code diffs, highlights breaking changes, and suggests production improvements.
- **Voice-Enabled Interface**: Ask codebase questions using browser-native SpeechRecognition.
- **End-to-End Type Safety & Observability**: Strict Zod schema validation, Sentry profiling, Morgan logging, and full Jest/Supertest test coverage.

---

## Architecture & Tech Stack

```
┌───────────────────────────────────────────────────────────┐
│              React 18 + TypeScript + Tailwind CSS         │
│     Chat UI · Apple-Themed Modals · SSE Stream Handler    │
└─────────────────────────────┬─────────────────────────────┘
                              │ HTTP / SSE (EventStream)
┌─────────────────────────────▼─────────────────────────────┐
│                 Express.js + TypeScript API               │
│     Zod Validation · Morgan Logging · Sentry Profiling    │
└──────────────┬──────────────┬──────────────┬──────────────┘
               │              │              │
        ┌──────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
        │ Auth Module │ │  Indexer  │ │  RAG Chat   │
        │  JWT + Bcr  │ │AST + Chunks││Retriever+SSE│
        └──────┬──────┘ └─────┬─────┘ └──────┬──────┘
               │              │              │
┌──────────────▼──────────────▼──────────────▼──────────────┐
│                    MongoDB Atlas Cluster                  │
│       Users · Chunks Collection · $vectorSearch Index     │
└─────────────────────────────┬─────────────────────────────┘
                              │
               ┌──────────────┴──────────────┐
               │    Google Gemini API /      │
               │  Local MiniLM Transformers  │
               └─────────────────────────────┘
```

### Core Technologies
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Monaco Editor support.
- **Backend**: Node.js, Express, TypeScript, Zod, Morgan, Sentry (`@sentry/node`), `@xenova/transformers`.
- **Database**: MongoDB Atlas with Vector Search (`$vectorSearch` cosine similarity).
- **AI Models**: Google Gemini 2.0 / 1.5 Flash, Gemini Embeddings, Xenova/all-MiniLM-L6-v2 (Local Embedder).
- **Testing**: Jest, Supertest, MongoMemoryServer, Babel TypeScript preset.

---

## Project Structure

```
DevGrasp/
├── client/                     # React 18 + TypeScript frontend
│   ├── src/
│   │   ├── components/         # ChatMessage, RepoModal, FileViewerModal, SettingsModal
│   │   ├── context/            # AuthContext (JWT session state)
│   │   ├── hooks/              # Custom domain hooks (useChat, useRepos, useVoice, etc.)
│   │   ├── pages/              # ChatApp, Home, Login, Signup
│   │   └── utils/              # SSE Stream consumer (streamSSE.ts)
│   └── package.json
│
├── server/                     # Express + TypeScript backend
│   ├── controllers/            # authController, repoController, chatController
│   ├── middleware/             # requireApiKey auth, Zod validation, error handlers
│   ├── models/                 # Mongoose models: User, Chunk, RepoStatus, Conversation
│   ├── routes/                 # Express routers (/api/auth, /api/repos, /api/chat)
│   ├── schemas/                # Zod request validation schemas
│   ├── services/               # indexer.ts, retriever.ts, promptBuilder.ts, usageTracker.ts
│   ├── tests/                  # Jest + Supertest test suite
│   ├── index.ts                # Server entry point & rate limiting configuration
│   └── package.json
│
├── CONTRIBUTING.md             # Developer guidelines & workflow
├── LICENSE                     # MIT License
└── README.md
```

---

## ⚡ Quick Start

### 1. Clone & Configure
```bash
git clone https://github.com/john-git7/DevGrasp.git
cd DevGrasp
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
```
Fill in the required `.env` values (`MONGO_URI`, `GEMINI_KEY`, `JWT_SECRET`, `CLIENT_URL`).

### 3. Frontend Setup
```bash
cd ../client
npm install
cp .env.example .env
```

### 4. Run Locally
```bash
# Start backend (from server/)
npm run dev

# Start frontend (from client/)
npm run dev
```

---

## Testing & Validation

```bash
# Run server unit and integration test suite
cd server
npm test
```

---

## API Reference

### Authentication (`/api/auth`)
| Method | Route | Description | Validation |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | `registerSchema` (email, password, name) |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | `loginSchema` (email, password) |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Bearer Token |
| `POST` | `/api/auth/github-token` | Store encrypted GitHub token | `githubTokenSchema` |

### Repositories (`/api/repos`)
| Method | Route | Description | Validation |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/repos/indexed` | List user's indexed repositories | Bearer Token |
| `POST` | `/api/repos/index` | Index GitHub repository | `indexRepoSchema` (url, model, exclusions) |
| `POST` | `/api/repos/analyze` | Pre-index file tree analysis | `repoUrlSchema` |
| `GET` | `/api/repos/status` | Polling endpoint for indexing progress | Query `url` |
| `DELETE` | `/api/repos/delete` | Remove indexed repository data | `repoUrlSchema` |

### AI & Chat (`/api/chat`)
| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/chat` | Main RAG chat endpoint with Server-Sent Events (SSE) |
| `POST` | `/api/chat/bug-trace` | Bug root-cause tracing with targeted AST context |
| `POST` | `/api/chat/onboarding` | Architecture walkthrough generator for new repos |
| `POST` | `/api/chat/pr-review` | Automated GitHub Pull Request code reviewer |
| `GET` | `/api/chat/history` | Fetch conversation history for active repository |

---

## License
This project is licensed under the [MIT License](LICENSE).

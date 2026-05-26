# 🤖 MultiSource AI — RAG Chatbot

A production-ready full-stack AI chatbot that answers questions grounded in your own sources: **PDFs**, **websites**, and **YouTube videos** — powered by Google Gemini + ChromaDB + LangChain-style RAG architecture.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **PDF Ingestion** | Upload and extract text from PDF files |
| 🌐 **Website Scraping** | Scrape and index any public webpage |
| 🎬 **YouTube Transcripts** | Extract and index video transcripts |
| 🧠 **RAG Pipeline** | Semantic search over embedded chunks |
| 🔒 **Grounded Answers** | AI answers ONLY from your sources |
| 🌊 **Streaming Responses** | Token-by-token streaming via SSE |
| 📌 **Source Citations** | Every answer shows which sources were used |
| 🗑️ **Source Management** | View, refresh, and delete ingested sources |
| 🌙 **Dark Mode** | Modern glassmorphism dark UI |
| 📱 **Responsive** | Works on desktop and mobile |

---

## 🏗️ Architecture

```
Frontend (React + Tailwind + Framer Motion)
        │
        │  HTTP + Server-Sent Events (SSE)
        ▼
Backend (Node.js + Express.js)
        │
        ├── Ingestion Layer
        │   ├── pdf-parse        ← PDF text extraction
        │   ├── cheerio          ← Website scraping
        │   └── youtube-transcript ← YouTube captions
        │
        ├── Embedding Service
        │   └── @xenova/transformers (all-MiniLM-L6-v2, local ONNX)
        │
        ├── Vector Store
        │   └── ChromaDB (Docker) ← Semantic similarity search
        │
        └── Generation
            └── Google Gemini 1.5 Flash ← RAG-grounded responses
```

---

## 🔄 RAG Workflow

```
1. User uploads source (PDF / URL / YouTube)
         ↓
2. Text extracted from source
         ↓
3. Text split into ~400-word chunks (50-word overlap)
         ↓
4. Each chunk embedded with all-MiniLM-L6-v2 (384-dim vectors)
         ↓
5. Embeddings + chunks stored in ChromaDB
         ↓
6. User asks a question
         ↓
7. Question embedded with same model
         ↓
8. Cosine similarity search → top 6 relevant chunks retrieved
         ↓
9. Chunks + question injected into Gemini prompt
         ↓
10. Gemini generates grounded answer (streaming)
         ↓
11. Answer streamed to UI with source citations
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+
- **Docker Desktop** (for ChromaDB)
- **Gemini API Key** — get one free at [aistudio.google.com](https://aistudio.google.com)

---

### Step 1 — Start ChromaDB

```bash
# In the project root
docker compose up -d
```

Verify ChromaDB is running:
```bash
curl http://localhost:8000/api/v1/heartbeat
# Expected: {"nanosecond heartbeat": ...}
```

---

### Step 2 — Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment (already set if you used the installer)
# Edit .env if needed:
# GEMINI_API_KEY=your_key_here

# Start backend (dev mode with auto-restart)
npm run dev

# Or production
npm start
```

Backend runs at: **http://localhost:5000**

> **Note:** On first run, the embedding model (`all-MiniLM-L6-v2`, ~45MB) will be downloaded automatically and cached. This only happens once.

---

### Step 3 — Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `GEMINI_API_KEY` | — | **Required.** Your Google Gemini API key |
| `CHROMA_URL` | `http://localhost:8000` | ChromaDB server URL |
| `CHROMA_COLLECTION` | `rag_collection` | ChromaDB collection name |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin |
| `PORT` | `5000` | Express server port |
| `NODE_ENV` | `development` | Environment mode |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API base URL |

---

## 📡 API Reference

### Upload Endpoints

```http
POST /api/upload/pdf
Content-Type: multipart/form-data
Body: pdf (file)

POST /api/upload/website
Content-Type: application/json
Body: { "url": "https://example.com" }

POST /api/upload/youtube
Content-Type: application/json
Body: { "url": "https://youtube.com/watch?v=VIDEO_ID" }
```

### Chat Endpoint (SSE Streaming)

```http
POST /api/chat
Content-Type: application/json
Body: { "message": "What is this document about?" }

Response: text/event-stream
data: {"type": "sources", "sources": [...]}
data: {"type": "token", "text": "The document..."}
data: {"type": "done"}
```

### Source Management

```http
GET  /api/sources
DELETE /api/source/:id
GET  /api/health
```

---

## 📁 Project Structure

```
MultiSource-RAG/
│
├── docker-compose.yml          # ChromaDB Docker setup
├── README.md
│
├── backend/
│   ├── server.js               # Express app entry point
│   ├── .env                    # Environment variables
│   ├── package.json
│   │
│   ├── routes/
│   │   ├── upload.js           # Upload routes
│   │   ├── chat.js             # Chat route
│   │   └── sources.js          # Source CRUD routes
│   │
│   ├── controllers/
│   │   ├── uploadController.js # Ingestion orchestration
│   │   ├── chatController.js   # SSE streaming chat
│   │   └── sourcesController.js
│   │
│   ├── services/
│   │   ├── pdfService.js       # PDF text extraction
│   │   ├── webService.js       # Website scraping
│   │   ├── youtubeService.js   # YouTube transcript
│   │   ├── embeddingService.js # @xenova/transformers
│   │   ├── chromaService.js    # ChromaDB CRUD
│   │   ├── ragService.js       # Context retrieval + prompt
│   │   └── geminiService.js    # Gemini streaming
│   │
│   ├── utils/
│   │   ├── textChunker.js      # Sliding window chunker
│   │   └── sourceStore.js      # JSON file persistence
│   │
│   ├── uploads/                # Temp PDF uploads (auto-cleaned)
│   └── data/
│       └── sources.json        # Source metadata persistence
│
└── frontend/
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    │
    └── src/
        ├── App.jsx
        ├── index.css
        │
        ├── context/
        │   └── SourceContext.jsx  # Global source state
        │
        ├── layouts/
        │   └── MainLayout.jsx     # 3-column layout
        │
        ├── pages/
        │   └── ChatPage.jsx
        │
        ├── components/
        │   ├── Sidebar.jsx
        │   ├── ChatInput.jsx
        │   ├── MessageList.jsx
        │   ├── Message.jsx        # Markdown + source citations
        │   ├── SourcePanel.jsx    # Upload + manage sources
        │   ├── UploadForm.jsx     # PDF/Website/YouTube tabs
        │   ├── SourceCard.jsx
        │   └── TypingIndicator.jsx
        │
        ├── hooks/
        │   └── useChat.js         # SSE streaming hook
        │
        └── services/
            └── api.js             # Axios + fetch utilities
```

---

## 🔮 Future Enhancements

- [ ] User authentication and multi-user sessions
- [ ] Persistent chat history in a database
- [ ] Support for DOCX, TXT, CSV file formats
- [ ] Multi-language support
- [ ] Source search/filter UI
- [ ] Conversation export (PDF/Markdown)
- [ ] Custom embedding model selection
- [ ] Re-ingestion of updated sources
- [ ] WebSocket for real-time collaboration

---

## 🛠️ Troubleshooting

**ChromaDB connection error**
```bash
# Ensure Docker is running and ChromaDB is up
docker compose ps
docker compose up -d
```

**Embedding model download stuck**
The model downloads on first use (~45MB). Check your internet connection. Cached in `node_modules/.cache`.

**YouTube transcript not found**
The video must have closed captions/subtitles enabled. Auto-generated captions also work.

**CORS errors in browser**
Ensure `FRONTEND_URL` in `backend/.env` matches your frontend URL exactly.

---

## 📄 License

MIT — free to use, modify, and distribute.

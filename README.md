# MultiSource-RAG Chatbot

An AI-powered Retrieval-Augmented Generation (RAG) chatbot that can answer questions from multiple data sources including PDFs, websites, and YouTube videos using semantic search and Google Gemini AI.

---

## Features

* PDF document ingestion
* Website content extraction
* YouTube transcript ingestion
* AI-powered question answering
* Semantic search using vector embeddings
* ChromaDB vector database integration
* Modern responsive UI
* Real-time ingestion status
* Source-aware responses
* Multi-source context retrieval

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Framer Motion
* Lucide React

### Backend

* Node.js
* Express.js
* Multer

### AI & Vector Database

* Google Gemini API
* ChromaDB
* Embeddings-based semantic retrieval

### Dev Tools

* Docker
* Git & GitHub

---

## Project Architecture

```txt
User Query
    ↓
Frontend (React + Vite)
    ↓
Backend API (Node.js + Express)
    ↓
RAG Pipeline
 ├── PDF Loader
 ├── Website Scraper
 └── YouTube Transcript Extractor
    ↓
Text Chunking
    ↓
Embeddings Generation
    ↓
ChromaDB Vector Store
    ↓
Semantic Retrieval
    ↓
Gemini AI Response Generation
    ↓
Answer Returned to User

## Installation

## 1. Clone Repository

```bash
git clone https://github.com/Sanjaya1822/multisource-rag-chatbot.git
cd multisource-rag-chatbot
```

---

## 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

## 3. Setup Backend

```bash
cd backend
npm install --legacy-peer-deps
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

## 4. Setup ChromaDB

Ensure Docker Desktop is running.

Then run:

```bash
docker compose up -d
```

ChromaDB runs on:

```txt
http://localhost:8000
```

---

## Environment Variables

Create a `.env` file inside the backend folder:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Get Gemini API Key from:

[Google AI Studio](https://aistudio.google.com/app/apikey?utm_source=chatgpt.com)

---

## Usage

### Upload PDF

* Drag and drop PDF files
* AI indexes content automatically

### Website Ingestion

* Paste website/article URL
* Extracts readable content

### YouTube Ingestion

* Paste YouTube video URL
* Uses transcript/captions for indexing

### Ask Questions

Examples:

* "Summarize this document"
* "What are the key points?"
* "Explain chapter 2"
* "What did the speaker say about AI?"

---

## Folder Structure

```txt
MultiSource-RAG/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   └── server.js
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## Future Improvements

* JWT Authentication
* Chat History
* Multiple Chat Sessions
* Streaming Responses
* Markdown Rendering
* User-specific Vector Collections
* Cloud Deployment
* LangChain Integration
* Voice Input Support

---

## Learning Outcomes

This project demonstrates practical understanding of:

* Retrieval-Augmented Generation (RAG)
* Large Language Models (LLMs)
* Vector Databases
* Embeddings
* Semantic Search
* Full-stack Development
* REST APIs
* Docker
* AI Application Development

---

## Author

**Sanjaya M**

* LinkedIn: [LinkedIn Profile](https://www.linkedin.com/in/sanjaya-m-085738349?utm_source=chatgpt.com)
* GitHub: [GitHub Profile](https://github.com/Sanjaya1822?utm_source=chatgpt.com)


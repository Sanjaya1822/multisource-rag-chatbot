# MultiSource-RAG Chatbot

An AI-powered RAG (Retrieval-Augmented Generation) chatbot that can answer questions from:

- PDFs
- Websites
- YouTube videos

## Tech Stack

Frontend:
- React + Vite
- Tailwind CSS
- Framer Motion

Backend:
- Node.js
- Express.js

AI & Vector DB:
- Google Gemini API
- ChromaDB

## Features

- PDF ingestion
- Website scraping
- YouTube transcript ingestion
- Semantic search
- AI-generated answers
- Source citations
- Modern responsive UI

## Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install --legacy-peer-deps
npm run dev
```

### ChromaDB

```bash
docker compose up -d
```

## Environment Variables

Create `.env` in backend:

```env
GEMINI_API_KEY=your_api_key
```

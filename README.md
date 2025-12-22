# 🔍 Aura Search — AI-Powered PDF Search Chat

Aura Search is a **Perplexity-style AI search interface** that lets users ask questions, receive **streaming AI responses**, view **inline citations**, and seamlessly jump into the **source PDF** that backs each answer.

The goal of this project is not to build a large-scale search engine, but to demonstrate **modern AI product architecture**: streaming responses, traceable citations, clean UI transitions, and reliable backend design.

---

## ✨ What This Project Demonstrates

* Real-time **Server-Sent Events (SSE)** streaming from backend to frontend
* Structured streaming (text chunks, tool steps, citations)
* Clear **citation → source traceability**
* Smooth UI transitions between chat and PDF viewer
* Clean separation of frontend, backend, and async job handling

This project focuses on **correct patterns and UX**, not dataset scale.

---

## 🚀 Quick Start

### Prerequisites

* Python 3.11+
* Node.js 18+
* npm or yarn

---

## 🔧 Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
mkdir pdfs   # Place your PDF files here

python -m uvicorn app.main:app --reload
```

Backend will run at:
👉 [http://localhost:8000](http://localhost:8000)

---

## 🎨 Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:
👉 [http://localhost:3000](http://localhost:3000)

---

## 🧪 Test the API (Optional)

```bash
curl -X POST http://localhost:8000/api/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"query\": \"test\"}"
```

---

## 🐳 Docker (Optional)

The entire stack can be run using Docker:

```bash
docker-compose up --build
```

---

## 📁 Project Structure

```
Aura Search/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── routes.py        # API endpoints
│   │   ├── queue.py         # In-memory async job manager
│   │   ├── agent.py         # LangGraph-based orchestration
│   │   └── pdf_processor.py# PDF text extraction
│   ├── pdfs/                # Static PDF sources
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Chat UI, PDF viewer
│   ├── lib/
│   │   ├── store/           # Zustand global state
│   │   └── hooks/           # Streaming logic
│   ├── tailwind.config.ts
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## ✨ Features

### Chat Experience

* Clean, centered **Perplexity-style UI**
* Real-time streaming AI responses
* Typing indicators and streaming cursor
* Tool step indicators (e.g. *Searching documents…*)

### Citations & Sources

* Inline numbered citations like `[1]`, `[2]`
* Source cards below each response
* Deterministic mapping from answer → PDF → page

### PDF Viewer

* Slide-in viewer with smooth animation
* Loads real PDFs served from the backend
* Automatically opens to the cited page
* Page navigation, zoom controls, and close action
* Responsive:

  * Mobile → full screen
  * Desktop → split view (chat + PDF)

### UI & UX

* Dark mode (system preference)
* Mobile-first responsive layout
* Smooth transitions with Framer Motion

---

## 🔌 API Overview

| Endpoint               | Method | Description                             |
| ---------------------- | ------ | --------------------------------------- |
| `/api/chat`            | POST   | Submit a user query, returns a `job_id` |
| `/api/stream/{job_id}` | GET    | Server-Sent Events stream               |
| `/api/job/{job_id}`    | GET    | Job status lookup                       |
| `/health`              | GET    | Health check                            |

---

## 🛠️ Tech Stack

### Backend

* **FastAPI** — API & SSE
* **LangGraph** — structured tool orchestration (simplified)
* **pdfplumber** — PDF text extraction
* **Uvicorn** — ASGI server

### Frontend

* **Next.js 14 (App Router)**
* **TypeScript (strict)**
* **Zustand** — global state management
* **Framer Motion** — UI transitions
* **Tailwind CSS**
* **@react-pdf-viewer** — PDF rendering

---

## 🌱 Environment Variables

### Backend (`.env`)

```
OPENAI_API_KEY=sk-xxx
DEBUG=False
LOG_LEVEL=INFO
```

### Frontend (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🧠 Architecture Overview

1. User submits a query
2. Backend creates an async job
3. Retrieval step selects relevant PDF pages
4. AI response is streamed via SSE:

   * Tool steps
   * Text chunks
   * Citation references
5. Frontend renders updates incrementally
6. Clicking a citation opens the PDF at the correct page

This mirrors how modern AI search products are structured, at a smaller and understandable scale.

---

## ⚖️ Design Decisions & Trade-offs

* **Small, preloaded PDF set**
  This project focuses on architecture and UX, not corpus scale.

* **Page-level citation accuracy**
  Text-coordinate highlighting is intentionally simplified to keep scope reasonable.

* **In-memory async job manager**
  Used instead of Redis/Celery for simplicity. The design can be swapped without changing APIs.

* **LangGraph used lightly**
  Demonstrates orchestration patterns, not full autonomous reasoning.

---

## ✅ Success Criteria Checklist

* ✔ Streaming responses work smoothly
* ✔ Tool steps are visible during generation
* ✔ Citations are clickable and accurate
* ✔ PDF viewer opens and navigates correctly
* ✔ UI transitions feel intentional
* ✔ Works on mobile and desktop

---

## 📄 License

MIT

---

### Final note

This project is intentionally scoped to demonstrate **how AI systems should feel**, not how large they are. Clean streaming, traceable answers, and thoughtful UX were prioritized throughout.
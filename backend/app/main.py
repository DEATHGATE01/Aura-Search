from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
from app.routes import router
from app.pdf_routes import router as pdf_router
from app.queue import job_queue
from app.pdf_processor import pdf_processor
from pathlib import Path
import logging
import asyncio

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up...")
    pdf_processor.preload_pdfs(Path("./pdfs"))
    
    # Start background workers
    for i in range(5):
        asyncio.create_task(job_queue.process_jobs(chat_handler))
    
    logger.info("Ready!")
    yield
    
    # Shutdown
    logger.info("Shutting down...")

app = FastAPI(title="AI Search Chat", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
app.include_router(pdf_router, prefix="/api")

# Serve PDFs with CORS support
@app.get("/pdfs/{filename}")
async def serve_pdf(filename: str):
    """Serve PDF files with proper CORS headers"""
    pdf_path = Path("./pdfs") / filename
    if not pdf_path.exists():
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="PDF not found")
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

@app.get("/health")
async def health():
    return {"status": "ok"}

# Import at bottom to avoid circular imports
from app.agent import chat_handler

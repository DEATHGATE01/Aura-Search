from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from pathlib import Path
from typing import Optional
from app.pdf_processor import pdf_processor
import shutil
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/pdfs", tags=["PDFs"])

PDF_DIR = Path("./pdfs")

@router.get("/list")
async def list_pdfs():
    """List all available PDFs"""
    pdfs = []
    for filename, info in pdf_processor.cache.items():
        pdfs.append({
            "filename": filename,
            "title": info.get("title", filename),
            "pages": info.get("pages", 0)
        })
    return {"pdfs": pdfs, "count": len(pdfs)}

@router.get("/metadata/{filename}")
async def get_pdf_metadata(filename: str):
    """Get metadata for a specific PDF"""
    if filename not in pdf_processor.cache:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    info = pdf_processor.cache[filename]
    return {
        "filename": filename,
        "title": info.get("title", filename),
        "pages": info.get("pages", 0)
    }

@router.get("/content/{filename}")
async def get_pdf_content(filename: str, page: Optional[int] = None):
    """Get text content from PDF"""
    if filename not in pdf_processor.cache:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    info = pdf_processor.cache[filename]
    
    if page:
        if page < 1 or page > len(info["pages_text"]):
            raise HTTPException(status_code=400, detail="Invalid page number")
        return {
            "filename": filename,
            "page": page,
            "text": info["pages_text"][page - 1]["text"]
        }
    
    return {
        "filename": filename,
        "full_text": info.get("full_text", "")
    }

@router.get("/search/{filename}")
async def search_pdf(filename: str, query: str):
    """Search for text in a PDF"""
    if filename not in pdf_processor.cache:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    info = pdf_processor.cache[filename]
    results = []
    
    for page_info in info["pages_text"]:
        if query.lower() in page_info["text"].lower():
            results.append({
                "page": page_info["page"],
                "snippet": _get_snippet(page_info["text"], query)
            })
    
    return {"filename": filename, "query": query, "results": results}

def _get_snippet(text: str, query: str, context_chars: int = 100) -> str:
    """Extract a snippet around the query"""
    lower_text = text.lower()
    lower_query = query.lower()
    
    idx = lower_text.find(lower_query)
    if idx == -1:
        return text[:200] + "..."
    
    start = max(0, idx - context_chars)
    end = min(len(text), idx + len(query) + context_chars)
    
    snippet = text[start:end]
    if start > 0:
        snippet = "..." + snippet
    if end < len(text):
        snippet = snippet + "..."
    
    return snippet

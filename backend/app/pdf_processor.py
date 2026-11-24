import logging
from pathlib import Path
from typing import Dict

import pdfplumber

logger = logging.getLogger(__name__)


class PDFProcessor:
    def __init__(self):
        self.cache: Dict[str, dict] = {}

    def preload_pdfs(self, pdf_dir: Path):
        """Extract and cache all PDFs at startup"""
        if not pdf_dir.exists():
            logger.warning(f"PDF directory not found: {pdf_dir}")
            return

        for pdf_path in pdf_dir.glob("*.pdf"):
            try:
                logger.info(f"Preloading PDF: {pdf_path.name}")
                self.cache[pdf_path.name] = self.extract_pdf_info(pdf_path)
            except Exception as e:
                logger.error(f"Failed to load {pdf_path.name}: {e}")

    def extract_pdf_info(self, pdf_path: Path) -> dict:
        """Extract text and metadata from PDF"""
        try:
            with pdfplumber.open(pdf_path) as pdf:
                pages_text = []
                full_text = ""

                for page_num, page in enumerate(pdf.pages, 1):
                    text = page.extract_text() or ""
                    pages_text.append({
                        "page": page_num,
                        "text": text,
                        "height": page.height,
                        "width": page.width
                    })
                    full_text += f"\n--- Page {page_num} ---\n{text}"

                return {
                    "filename": pdf_path.name,
                    "title": pdf.metadata.get("Title", pdf_path.stem) if pdf.metadata else pdf_path.stem,
                    "pages": len(pdf.pages),
                    "pages_text": pages_text,
                    "full_text": full_text
                }
        except Exception as e:
            logger.error(f"PDF extraction error: {e}")
            raise

    def get_page_text(self, filename: str, page_num: int) -> str:
        """Get text from a specific page"""
        if filename not in self.cache:
            return ""

        info = self.cache[filename]
        if page_num > len(info["pages_text"]):
            return ""

        return info["pages_text"][page_num - 1]["text"]


pdf_processor = PDFProcessor()

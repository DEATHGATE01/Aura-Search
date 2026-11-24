"""Tests for PDF processor module."""
import pytest
from pathlib import Path
from app.pdf_processor import PDFProcessor


def test_pdf_processor_init():
    """Test PDFProcessor initializes correctly."""
    processor = PDFProcessor()
    assert processor is not None
    assert hasattr(processor, 'preload_pdfs')
    assert hasattr(processor, 'search')


def test_preload_pdfs_empty_dir(tmp_path):
    """Test preloading PDFs from empty directory."""
    processor = PDFProcessor()
    processor.preload_pdfs(tmp_path)
    assert len(processor.documents) == 0


def test_preload_pdfs_missing_dir():
    """Test preloading from non-existent directory."""
    processor = PDFProcessor()
    missing = Path("/nonexistent/path")
    processor.preload_pdfs(missing)
    assert len(processor.documents) == 0

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useChatStore } from '@/lib/store/chat-store';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, Search } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker from CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer() {
  const { pdfViewer, closePDFViewer } = useChatStore();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [matchCount, setMatchCount] = useState<number>(0);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  // Create blob URL to avoid CORS and detached buffer issues
  useEffect(() => {
    if (!pdfViewer.docId) {
      setPdfUrl(null);
      return;
    }
    
    let objectUrl: string | null = null;
    
    setLoading(true);
    setError(null);
    setPdfUrl(null);
    
    const fetchPdf = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/pdfs/${pdfViewer.docId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (err) {
        console.error('PDF fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch PDF');
        setLoading(false);
      }
    };
    
    fetchPdf();

    // Cleanup blob URL on unmount or docId change
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [pdfViewer.docId]);

  // Update page when pdfViewer.page changes
  useEffect(() => {
    if (pdfViewer.page && pdfViewer.page > 0) {
      setPageNumber(pdfViewer.page);
    }
  }, [pdfViewer.page]);

  // Set search text from citation highlight
  useEffect(() => {
    if (pdfViewer.highlight) {
      setSearchText(pdfViewer.highlight);
    }
  }, [pdfViewer.highlight]);

  // Highlight matching text in the PDF text layer
  const highlightTextOnPage = useCallback((textToHighlight: string) => {
    if (!textToHighlight || !pageContainerRef.current) {
      setMatchCount(0);
      return;
    }

    // Wait for text layer to render
    setTimeout(() => {
      const textLayer = pageContainerRef.current?.querySelector('.react-pdf__Page__textContent');
      if (!textLayer) return;

      const spans = textLayer.querySelectorAll('span');
      let count = 0;

      spans.forEach((span) => {
        // Reset any previous highlighting
        (span as HTMLElement).style.backgroundColor = '';
        (span as HTMLElement).style.borderRadius = '';
        (span as HTMLElement).style.mixBlendMode = '';
        
        const spanText = span.textContent || '';
        if (spanText.toLowerCase().includes(textToHighlight.toLowerCase())) {
          (span as HTMLElement).style.backgroundColor = 'rgba(251, 191, 36, 0.4)'; // Semi-transparent amber
          (span as HTMLElement).style.borderRadius = '2px';
          (span as HTMLElement).style.mixBlendMode = 'multiply';
          count++;
          
          // Scroll to first match
          if (count === 1) {
            span.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });

      setMatchCount(count);
    }, 300); // Wait for text layer to render
  }, []);

  // Re-highlight when page loads or search changes
  const onPageRenderSuccess = useCallback(() => {
    if (searchText) {
      highlightTextOnPage(searchText);
    }
  }, [searchText, highlightTextOnPage]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
    if (pdfViewer.page && pdfViewer.page > 0 && pdfViewer.page <= numPages) {
      setPageNumber(pdfViewer.page);
    }
  }, [pdfViewer.page]);

  const onDocumentLoadError = useCallback((err: Error) => {
    console.error('PDF load error:', err);
    setError('Failed to render PDF: ' + err.message);
    setLoading(false);
  }, []);

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.5));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    highlightTextOnPage(searchText);
  };

  return (
    <div className="h-full flex flex-col bg-[#0f1115]">
      {/* Header */}
      <div className="border-b border-white/5 p-4 flex items-center justify-between shrink-0">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white truncate">
            {pdfViewer.docId || 'No document'}
          </p>
          <p className="text-sm text-gray-400">
            {numPages > 0 ? `Page ${pageNumber} of ${numPages}` : 'Loading...'}
          </p>
        </div>
        <button
          onClick={closePDFViewer}
          className="p-2 hover:bg-white/5 rounded-lg transition ml-2 shrink-0"
          aria-label="Close PDF viewer"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="border-b border-white/5 p-3 flex gap-2 shrink-0">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search in document..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
        >
          Find
        </button>
      </form>

      {/* Match count indicator */}
      {searchText && matchCount > 0 && (
        <div className="bg-green-500/10 border-b border-green-500/20 px-4 py-2 shrink-0">
          <p className="text-sm text-green-400">
            <span className="font-medium">✓ Found {matchCount} match{matchCount !== 1 ? 'es' : ''}</span> for &quot;{searchText}&quot;
          </p>
        </div>
      )}

      {searchText && matchCount === 0 && !loading && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 shrink-0">
          <p className="text-sm text-yellow-400">
            No matches found for &quot;{searchText}&quot;
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="border-b border-white/5 p-3 flex items-center justify-center gap-4 shrink-0">
        {/* Page navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1 || loading}
            className="p-2 hover:bg-white/5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft size={18} className="text-gray-400" />
          </button>
          
          <span className="text-sm font-medium text-gray-300 min-w-[80px] text-center">
            {numPages > 0 ? `${pageNumber} / ${numPages}` : '...'}
          </span>
          
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages || loading}
            className="p-2 hover:bg-white/5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="w-px h-6 bg-white/10" />

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5 || loading}
            className="p-2 hover:bg-white/5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom out"
          >
            <ZoomOut size={18} className="text-gray-400" />
          </button>
          <span className="text-sm font-medium text-gray-400 min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={scale >= 2.5 || loading}
            className="p-2 hover:bg-white/5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom in"
          >
            <ZoomIn size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-[#0a0a0f] flex justify-center p-4">
        {error ? (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <X size={32} className="text-red-400" />
            </div>
            <p className="text-red-400 font-medium mb-2">Error Loading PDF</p>
            <p className="text-gray-500 text-sm max-w-xs">{error}</p>
          </div>
        ) : loading && !pdfUrl ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 size={40} className="text-indigo-500 animate-spin mb-4" />
            <p className="text-gray-400">Loading PDF...</p>
          </div>
        ) : pdfUrl ? (
          <div ref={pageContainerRef}>
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex flex-col items-center justify-center p-8">
                  <Loader2 size={32} className="text-indigo-500 animate-spin mb-2" />
                  <p className="text-gray-400 text-sm">Rendering...</p>
                </div>
              }
              className="max-w-full"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                onRenderSuccess={onPageRenderSuccess}
                loading={
                  <div className="flex items-center justify-center p-8 min-h-[400px]">
                    <Loader2 size={24} className="text-indigo-500 animate-spin" />
                  </div>
                }
                className="shadow-xl rounded-lg overflow-hidden"
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <p className="text-gray-500">No PDF selected</p>
          </div>
        )}
      </div>
    </div>
  );
}

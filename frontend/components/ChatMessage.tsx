'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Copy, ThumbsUp, ThumbsDown, Sparkles, User, ExternalLink } from 'lucide-react';
import { useChatStore } from '@/lib/store/chat-store';
import type { ChatMessage as ChatMessageType, Citation } from '@/lib/types';

interface ChatMessageProps {
  message: ChatMessageType;
  isLast: boolean;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isLast, isStreaming = false }: ChatMessageProps) {
  const { openPDFViewer } = useChatStore();
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4 py-8"
      >
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-gray-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-medium text-white">{message.content}</h3>
        </div>
      </motion.div>
    );
  }

  // Parse citations in content
  const renderContentWithCitations = (content: string) => {
    const parts = content.split(/(\[\d+\])/);
    return parts.map((part, i) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const refNum = parseInt(match[1]);
        const citation = message.citations?.find((c) => c.ref === refNum);
        return (
          <button
            key={i}
            onClick={() => {
              if (citation) {
                openPDFViewer(citation.docId, citation.page, citation.highlight || '');
              }
            }}
            className="inline-flex items-center justify-center w-5 h-5 mx-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 rounded hover:bg-indigo-500/30 transition-colors cursor-pointer"
          >
            {refNum}
          </button>
        );
      }
      return part;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 py-2 pb-12 border-b border-white/5 last:border-0"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20 mt-1">
        <Sparkles className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 space-y-6 max-w-3xl">
        {/* Tool calls */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="space-y-2">
            {message.toolCalls.map((tc) => (
              <div
                key={tc.id}
                className="flex items-center gap-2 text-sm text-gray-400"
              >
                <div
                  className={`w-3 h-3 border-2 border-indigo-500 rounded-full ${
                    tc.status === 'in_progress'
                      ? 'border-t-transparent animate-spin'
                      : 'bg-indigo-500'
                  }`}
                />
                <span>{tc.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Sources Grid */}
        {message.citations && message.citations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Sources
            </div>
            <div className="flex flex-wrap gap-2">
              {message.citations.map((citation, idx) => (
                <SourceCard
                  key={idx}
                  citation={citation}
                  index={idx}
                  onClick={() =>
                    openPDFViewer(citation.docId, citation.page, citation.highlight || '')
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Answer Content */}
        {message.content && (
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
              {renderContentWithCitations(message.content)}
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-indigo-500 ml-0.5 animate-pulse" />
              )}
            </p>
          </div>
        )}

        {/* Action Bar */}
        {message.content && !isStreaming && (
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => navigator.clipboard.writeText(message.content)}
              className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              title="Helpful"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              title="Not Helpful"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface SourceCardProps {
  citation: Citation;
  index: number;
  onClick: () => void;
}

function SourceCard({ citation, index, onClick }: SourceCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group max-w-[200px]"
    >
      <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 flex-shrink-0">
        {citation.ref}
      </div>
      <div className="flex flex-col overflow-hidden text-left">
        <span className="text-xs font-medium text-gray-200 truncate group-hover:text-indigo-300 transition-colors">
          {citation.title}
        </span>
        <span className="text-[10px] text-gray-500 truncate">Page {citation.page}</span>
      </div>
      <ExternalLink className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0" />
    </motion.button>
  );
}

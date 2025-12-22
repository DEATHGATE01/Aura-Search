'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/lib/store/chat-store';
import { useStreamChat } from '@/lib/hooks/useStreamChat';
import { ChatSidebar } from './ChatSidebar';
import { SearchInput } from './SearchInput';
import { ChatMessage } from './ChatMessage';
import PDFViewer from './PDFViewer';
import { Logo } from '@/components/ui/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/lib/types';

export default function ChatInterface() {
  const {
    messages,
    isLoading,
    currentJobId,
    pdfViewer,
    sidebarOpen,
    addMessage,
    setCurrentJob,
    setLoading,
    toggleSidebar,
    createNewThread,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useStreamChat(currentJobId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  useEffect(() => {
    // If there are any messages, start a new thread (fresh chat) when mounting
    if (messages.length > 0) {
      createNewThread();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start fresh chat when component mounts (coming from landing page)
  useEffect(() => {
    // Only reset if there's no active conversation (coming from landing)
    if (messages.length === 0) {
      setCurrentJob(null);
      setLoading(false);
    }
    // Prevent browser back navigation to landing page
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      setCurrentJob(null);
      setLoading(false);
    };
  }, [setCurrentJob, setLoading, messages.length]);

  const handleSearch = async (userQuery: string) => {
    if (!userQuery.trim()) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: userQuery,
      timestamp: new Date()
    };
    addMessage(userMessage);

    const assistantMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      toolCalls: [],
      citations: []
    };
    addMessage(assistantMessage);

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery })
      });

      const data = await response.json();
      setCurrentJob(data.job_id);
    } catch (error) {
      console.error('Failed to start chat:', error);
      setLoading(false);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 bg-[#0a0a0f]/80 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden md:block">
              <Logo className="w-6 h-6" showText={false} />
            </div>
          </div>
          {hasMessages && (
            <div className="flex-1 max-w-2xl mx-4">
              <SearchInput onSearch={handleSearch} compact />
            </div>
          )}
          <div className="w-10" />
        </header>

        {/* Main Area with PDF Viewer */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <main className={`flex-1 overflow-y-auto scrollbar-hide transition-all duration-300 ${pdfViewer.isOpen ? 'w-1/2' : 'w-full'}`}>
            <div className="max-w-3xl mx-auto px-4 py-8 min-h-full flex flex-col">
              <AnimatePresence mode="wait">
                {!hasMessages ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex-1 flex flex-col items-center justify-center -mt-20"
                  >
                    <div className="mb-8 scale-150">
                      <Logo className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-medium text-white mb-8 text-center">
                      What would you like to know?
                    </h1>
                    <SearchInput onSearch={handleSearch} centered />
                  </motion.div>
                ) : (
                  <div className="space-y-6 pb-20">
                    {messages.map((msg, idx) => (
                      <ChatMessage
                        key={msg.id}
                        message={msg}
                        isLast={idx === messages.length - 1}
                        isStreaming={isLoading && idx === messages.length - 1 && msg.role === 'assistant'}
                      />
                    ))}

                    {isLoading && messages[messages.length - 1]?.role === 'assistant' && messages[messages.length - 1]?.content === '' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-4 py-8"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </main>

          {/* PDF Viewer Panel */}
          <AnimatePresence>
            {pdfViewer.isOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '50%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-l border-white/5 bg-[#0f1115] overflow-hidden"
              >
                <PDFViewer />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

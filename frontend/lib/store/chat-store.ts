import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage, StreamEvent, PDFViewerState } from '@/lib/types';

export interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatStore {
  // Current chat state
  messages: ChatMessage[];
  isLoading: boolean;
  currentJobId: string | null;
  pdfViewer: PDFViewerState;
  
  // Chat history
  threads: ChatThread[];
  currentThreadId: string | null;
  sidebarOpen: boolean;

  // Message actions
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (update: Partial<ChatMessage>) => void;
  setLoading: (loading: boolean) => void;
  setCurrentJob: (jobId: string | null) => void;
  streamEvent: (event: StreamEvent) => void;
  
  // PDF viewer actions
  openPDFViewer: (docId: string, page: number, highlight: string) => void;
  closePDFViewer: () => void;
  
  // Thread/history actions
  createNewThread: () => void;
  switchThread: (threadId: string) => void;
  deleteThread: (threadId: string) => void;
  clearMessages: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const generateThreadTitle = (message: string): string => {
  const truncated = message.slice(0, 40);
  return message.length > 40 ? `${truncated}...` : truncated;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      currentJobId: null,
      pdfViewer: { isOpen: false, docId: null, page: 1, highlight: null },
      threads: [],
      currentThreadId: null,
      sidebarOpen: true,

      addMessage: (message: ChatMessage) => {
        const state = get();
        const newMessages = [...state.messages, message];
        
        // If this is the first user message, create a new thread
        if (message.role === 'user' && state.messages.length === 0) {
          const threadId = Date.now().toString();
          const newThread: ChatThread = {
            id: threadId,
            title: generateThreadTitle(message.content),
            messages: newMessages,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set({
            messages: newMessages,
            currentThreadId: threadId,
            threads: [newThread, ...state.threads],
          });
        } else {
          // Update existing thread
          set({ messages: newMessages });
          
          // Sync to thread
          if (state.currentThreadId) {
            const updatedThreads = state.threads.map((t) =>
              t.id === state.currentThreadId
                ? { ...t, messages: newMessages, updatedAt: new Date() }
                : t
            );
            set({ threads: updatedThreads });
          }
        }
      },

      updateLastMessage: (update: Partial<ChatMessage>) => {
        set((state) => {
          const messages = [...state.messages];
          const lastIndex = messages.length - 1;
          if (lastIndex >= 0) {
            messages[lastIndex] = { ...messages[lastIndex], ...update };
          }
          
          // Sync to thread
          if (state.currentThreadId) {
            const updatedThreads = state.threads.map((t) =>
              t.id === state.currentThreadId
                ? { ...t, messages, updatedAt: new Date() }
                : t
            );
            return { messages, threads: updatedThreads };
          }
          
          return { messages };
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setCurrentJob: (jobId: string | null) => {
        set({ currentJobId: jobId });
      },

      streamEvent: (event: StreamEvent) => {
        const state = get();
        const messages = [...state.messages];
        const lastMessage = messages[messages.length - 1];

        if (!lastMessage || lastMessage.role !== 'assistant') return;

        switch (event.type) {
          case 'text':
            lastMessage.content += event.content || '';
            break;

          case 'tool_call':
            if (!lastMessage.toolCalls) lastMessage.toolCalls = [];
            lastMessage.toolCalls.push({
              id: event.tool || 'unknown',
              name: event.tool || 'unknown',
              message: event.message || '',
              status: 'in_progress'
            });
            break;

          case 'tool_result':
            if (lastMessage.toolCalls?.length) {
              const lastTool = lastMessage.toolCalls[lastMessage.toolCalls.length - 1];
              lastTool.status = 'completed';
            }
            break;

          case 'citation':
            if (!lastMessage.citations) lastMessage.citations = [];
            lastMessage.citations.push({
              ref: event.ref || 0,
              docId: event.docId || '',
              title: event.title || '',
              page: event.page || 1,
              highlight: event.highlight
            });
            break;

          case 'ui_component':
            if (!lastMessage.components) lastMessage.components = [];
            lastMessage.components.push({
              id: event.componentType || 'component',
              type: (event.componentType as 'chart' | 'table' | 'card' | 'code_block') || 'card',
              props: event.props || {}
            });
            break;
        }

        // Sync to thread
        if (state.currentThreadId) {
          const updatedThreads = state.threads.map((t) =>
            t.id === state.currentThreadId
              ? { ...t, messages, updatedAt: new Date() }
              : t
          );
          set({ messages, threads: updatedThreads });
        } else {
          set({ messages });
        }
      },

      openPDFViewer: (docId: string, page: number, highlight: string) => {
        set({
          pdfViewer: { isOpen: true, docId, page, highlight }
        });
      },

      closePDFViewer: () => {
        set({
          pdfViewer: { isOpen: false, docId: null, page: 1, highlight: null }
        });
      },

      createNewThread: () => {
        set({
          messages: [],
          currentThreadId: null,
          currentJobId: null,
          isLoading: false,
          pdfViewer: { isOpen: false, docId: null, page: 1, highlight: null }
        });
      },

      switchThread: (threadId: string) => {
        const thread = get().threads.find((t) => t.id === threadId);
        if (thread) {
          set({
            currentThreadId: threadId,
            messages: thread.messages,
            currentJobId: null,
            isLoading: false,
            pdfViewer: { isOpen: false, docId: null, page: 1, highlight: null }
          });
        }
      },

      deleteThread: (threadId: string) => {
        const state = get();
        const updatedThreads = state.threads.filter((t) => t.id !== threadId);
        
        // If deleting current thread, clear messages
        if (state.currentThreadId === threadId) {
          set({
            threads: updatedThreads,
            messages: [],
            currentThreadId: null,
          });
        } else {
          set({ threads: updatedThreads });
        }
      },

      clearMessages: () => {
        set({
          messages: [],
          currentJobId: null,
          isLoading: false
        });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },
    }),
    {
      name: 'aura-chat-storage',
      partialize: (state) => ({
        threads: state.threads,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

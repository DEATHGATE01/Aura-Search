'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, MessageSquare, Clock, Settings, LogOut, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore, ChatThread } from '@/lib/store/chat-store';
import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const dateObj = new Date(date);
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return dateObj.toLocaleDateString();
}

export function ChatSidebar({ isOpen, onToggle }: ChatSidebarProps) {
  const { threads, currentThreadId, createNewThread, switchThread, deleteThread } = useChatStore();

  const recentThreads = threads.slice(0, 10);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onToggle}
        />
      )}

      <motion.div
        initial={{ width: isOpen ? 280 : 0, opacity: isOpen ? 1 : 0 }}
        animate={{ width: isOpen ? 280 : 0, opacity: isOpen ? 1 : 0 }}
        className={cn(
          'fixed md:relative z-30 h-full bg-[#0a0a0f] border-r border-white/5 flex flex-col overflow-hidden transition-all duration-300',
          !isOpen && 'hidden md:flex md:w-0 md:opacity-0 md:border-none'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Logo className="w-6 h-6" />
            </Link>
            <button
              onClick={onToggle}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={createNewThread}
            className="w-full flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-white transition-all group"
          >
            <Plus className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
            <span className="font-medium">New Thread</span>
            <span className="ml-auto text-xs text-gray-500 border border-white/10 px-1.5 py-0.5 rounded hidden sm:inline">
              ⌘K
            </span>
          </button>
        </div>

        {/* Threads list */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6 scrollbar-hide">
          {recentThreads.length > 0 && (
            <div>
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Recent
              </h3>
              <div className="space-y-1">
                {recentThreads.map((thread) => (
                  <ThreadItem
                    key={thread.id}
                    thread={thread}
                    isActive={thread.id === currentThreadId}
                    onSelect={() => switchThread(thread.id)}
                    onDelete={() => deleteThread(thread.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {recentThreads.length === 0 && (
            <div className="px-4 py-8 text-center">
              <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No conversations yet</p>
              <p className="text-xs text-gray-600 mt-1">Start a new thread to begin</p>
            </div>
          )}

          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Library
            </h3>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left">
                <Clock className="w-4 h-4" />
                <span>History</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left">
            <LogOut className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </motion.div>
    </>
  );
}

interface ThreadItemProps {
  thread: ChatThread;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function ThreadItem({ thread, isActive, onSelect, onDelete }: ThreadItemProps) {
  const [showDelete, setShowDelete] = React.useState(false);

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors text-left group',
        isActive
          ? 'bg-indigo-500/10 text-white border border-indigo-500/20'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      )}
    >
      <MessageSquare
        className={cn(
          'w-4 h-4 flex-shrink-0 transition-colors',
          isActive ? 'text-indigo-400' : 'text-gray-600 group-hover:text-indigo-400'
        )}
      />
      <div className="flex-1 min-w-0">
        <span className="block truncate">{thread.title}</span>
        <span className="text-[10px] text-gray-600">
          {formatTimeAgo(thread.updatedAt)}
        </span>
      </div>
      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </button>
  );
}

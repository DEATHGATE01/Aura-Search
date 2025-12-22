'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight, Paperclip, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  centered?: boolean;
  compact?: boolean;
  initialValue?: string;
}

const suggestions = [
  'Explain quantum computing',
  'Best practices for React',
  'How to make sourdough',
  'Latest AI news',
];

export function SearchInput({
  onSearch,
  placeholder = 'Ask anything...',
  centered = false,
  compact = false,
  initialValue = '',
}: SearchInputProps) {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  useEffect(() => {
    if (centered && inputRef.current) {
      inputRef.current.focus();
    }
  }, [centered]);

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="relative w-full">
        <div
          className={cn(
            'relative flex items-center bg-[#1a1a20] border rounded-xl transition-all duration-300 overflow-hidden',
            isFocused
              ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
              : 'border-white/10'
          )}
        >
          <div className="pl-3 text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full h-10 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 text-sm px-3 outline-none"
          />
          <AnimatePresence>
            {query.trim() && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="submit"
                className="p-1.5 mr-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'relative w-full transition-all duration-500 ease-out',
        centered ? 'max-w-2xl' : 'max-w-3xl'
      )}
    >
      <div
        className={cn(
          'relative flex items-center bg-[#1a1a20] border rounded-2xl transition-all duration-300 overflow-hidden',
          isFocused
            ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
            : 'border-white/10 shadow-lg',
          centered ? 'p-2' : 'p-1'
        )}
      >
        <div className={cn('pl-4 text-gray-400', centered ? 'scale-110' : 'scale-100')}>
          <Search className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            'w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 outline-none',
            centered ? 'h-14 text-lg px-4' : 'h-10 text-base px-3'
          )}
        />

        <div className="flex items-center gap-2 pr-2">
          {centered && (
            <>
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </>
          )}

          <AnimatePresence>
            {query.trim() && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {centered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mt-6"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setQuery(suggestion);
                onSearch(suggestion);
              }}
              className="px-4 py-2 text-sm text-gray-400 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 hover:text-white hover:border-white/10 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </motion.div>
      )}
    </form>
  );
}

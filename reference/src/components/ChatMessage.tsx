import React from 'react';
import { motion } from 'framer-motion';
import { Copy, ThumbsUp, ThumbsDown, Sparkles, User } from 'lucide-react';
import { SourceCard, Source } from './SourceCard';
import { RelatedQuestions } from './RelatedQuestions';
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  relatedQuestions?: string[];
}
interface ChatMessageProps {
  message: Message;
  isLast: boolean;
}
export function ChatMessage({
  message,
  isLast
}: ChatMessageProps) {
  const isUser = message.role === 'user';
  if (isUser) {
    return <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="flex gap-4 py-8">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-gray-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-medium text-white">{message.content}</h3>
        </div>
      </motion.div>;
  }
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="flex gap-4 py-2 pb-12 border-b border-white/5 last:border-0">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20 mt-1">
        <Sparkles className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 space-y-6 max-w-3xl">
        {/* Sources Grid */}
        {message.sources && message.sources.length > 0 && <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Sources
            </div>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, idx) => <SourceCard key={idx} source={source} index={idx} />)}
            </div>
          </div>}

        {/* Answer Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2 pt-2">
          <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-md transition-colors" title="Copy">
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-md transition-colors" title="Helpful">
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-md transition-colors" title="Not Helpful">
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>

        {/* Related Questions */}
        {message.relatedQuestions && <RelatedQuestions questions={message.relatedQuestions} onSelect={q => console.log('Selected:', q)} />}
      </div>
    </motion.div>;
}
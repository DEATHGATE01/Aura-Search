import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
export interface Source {
  title: string;
  domain: string;
  url: string;
  favicon?: string;
}
interface SourceCardProps {
  source: Source;
  index: number;
}
export function SourceCard({
  source,
  index
}: SourceCardProps) {
  return <motion.a href={source.url} target="_blank" rel="noopener noreferrer" initial={{
    opacity: 0,
    scale: 0.9
  }} animate={{
    opacity: 1,
    scale: 1
  }} transition={{
    delay: index * 0.1
  }} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group max-w-[200px]">
      <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 flex-shrink-0">
        {index + 1}
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-xs font-medium text-gray-200 truncate group-hover:text-indigo-300 transition-colors">
          {source.title}
        </span>
        <span className="text-[10px] text-gray-500 truncate">
          {source.domain}
        </span>
      </div>
      <ExternalLink className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
    </motion.a>;
}
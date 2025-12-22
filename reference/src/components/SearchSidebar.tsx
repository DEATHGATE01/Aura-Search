import React from 'react';
import { motion } from 'framer-motion';
import { Plus, MessageSquare, Clock, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
interface SearchSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}
const history = [{
  id: 1,
  title: 'Quantum Entanglement',
  time: '2m ago'
}, {
  id: 2,
  title: 'React Performance Tips',
  time: '1h ago'
}, {
  id: 3,
  title: 'Best Sci-Fi Movies 2024',
  time: '1d ago'
}, {
  id: 4,
  title: 'Sourdough Recipe',
  time: '2d ago'
}];
export function SearchSidebar({
  isOpen,
  onToggle
}: SearchSidebarProps) {
  return <motion.div initial={{
    width: isOpen ? 280 : 0,
    opacity: isOpen ? 1 : 0
  }} animate={{
    width: isOpen ? 280 : 0,
    opacity: isOpen ? 1 : 0
  }} className={cn('fixed md:relative z-30 h-full bg-[#0a0a0f] border-r border-white/5 flex flex-col overflow-hidden transition-all duration-300', !isOpen && 'hidden md:flex md:w-0 md:opacity-0 md:border-none')}>
      <div className="p-4">
        <button className="w-full flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-white transition-all group">
          <Plus className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
          <span className="font-medium">New Thread</span>
          <span className="ml-auto text-xs text-gray-500 border border-white/10 px-1.5 py-0.5 rounded">
            ⌘K
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-6">
        <div>
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Recent
          </h3>
          <div className="space-y-1">
            {history.map(item => <button key={item.id} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left group">
                <MessageSquare className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                <span className="truncate flex-1">{item.title}</span>
              </button>)}
          </div>
        </div>

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

      <div className="p-4 border-t border-white/5 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.div>;
}
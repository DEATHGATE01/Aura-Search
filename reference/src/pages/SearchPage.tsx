import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from '../components/Logo';
import { SearchSidebar } from '../components/SearchSidebar';
import { SearchInput } from '../components/SearchInput';
import { ChatMessage, Message } from '../components/ChatMessage';
const MOCK_RESPONSE: Message[] = [{
  id: '1',
  role: 'user',
  content: 'Explain quantum entanglement simply'
}, {
  id: '2',
  role: 'assistant',
  content: 'Quantum entanglement is a phenomenon where two particles become linked, such that the state of one instantly influences the other, no matter how far apart they are. Einstein famously called this "spooky action at a distance."\n\nImagine having two magic coins. If you flip one and it lands on heads, the other one will instantly land on tails, even if it\'s on the other side of the universe. This connection happens faster than the speed of light, though it cannot be used to transmit information faster than light.',
  sources: [{
    title: 'Quantum Mechanics - Wikipedia',
    domain: 'wikipedia.org',
    url: '#'
  }, {
    title: 'Understanding Entanglement',
    domain: 'science.org',
    url: '#'
  }, {
    title: 'Physics Today: Quantum',
    domain: 'physicstoday.org',
    url: '#'
  }],
  relatedQuestions: ['How is quantum entanglement used in computing?', 'Who discovered quantum entanglement?', 'Can entanglement transmit information?']
}];
export function SearchPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleSearch = (query: string) => {
    setHasSearched(true);
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setMessages(MOCK_RESPONSE);
      setIsLoading(false);
    }, 1500);
  };
  return <div className="flex h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Sidebar */}
      <SearchSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 bg-[#0a0a0f]/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden md:block">
              <Logo className="w-6 h-6" />
            </div>
          </div>
          {hasSearched && <div className="flex-1 max-w-2xl mx-4">
              <SearchInput onSearch={handleSearch} />
            </div>}
          <div className="w-10" /> {/* Spacer for balance */}
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-3xl mx-auto px-4 py-8 min-h-full flex flex-col">
            <AnimatePresence mode="wait">
              {!hasSearched ? <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} className="flex-1 flex flex-col items-center justify-center -mt-20">
                  <div className="mb-8 scale-150">
                    <Logo className="w-12 h-12" />
                  </div>
                  <h1 className="text-3xl font-medium text-white mb-8 text-center">
                    What would you like to know?
                  </h1>
                  <SearchInput onSearch={handleSearch} centered />
                </motion.div> : <div className="space-y-6 pb-20">
                  {messages.map((msg, idx) => <ChatMessage key={msg.id} message={msg} isLast={idx === messages.length - 1} />)}

                  {isLoading && <motion.div initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} className="flex gap-4 py-8">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                      </div>
                    </motion.div>}
                </div>}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>;
}
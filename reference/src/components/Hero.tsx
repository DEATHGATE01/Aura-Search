import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Search, Terminal } from 'lucide-react';
import { Button } from './ui/Button';
import { Link } from 'react-router-dom';
export function Hero() {
  return <section className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden bg-[#0a0a0f]">
      {/* Background Effects - subtler now */}
      <div className="absolute inset-0 w-full h-full bg-background pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Text */}
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6,
          ease: 'easeOut'
        }} className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <span className="text-xs font-medium text-indigo-300">
                New: Research Agents available
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Aura Search – <br />
              Research Reimagined
            </h1>

            <p className="text-lg text-gray-400 mb-10 max-w-xl leading-relaxed">
              Stop searching for links. Start finding answers. Aura delivers
              real-time, cited research backed by the world's most powerful AI
              models.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/search">
                <Button size="lg" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 border-none shadow-lg shadow-indigo-500/20">
                  Try Aura Search
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="h-12 px-6 text-gray-400 hover:text-white">
                <Play className="w-4 h-4 mr-2" />
                Watch demo
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-6 text-sm text-gray-500">
              <span>Trusted by researchers at</span>
              <div className="flex gap-4 opacity-50 grayscale">
                <div className="w-6 h-6 bg-white/20 rounded-full" />
                <div className="w-6 h-6 bg-white/20 rounded-full" />
                <div className="w-6 h-6 bg-white/20 rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Chat Demo */}
          <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2,
          ease: 'easeOut'
        }} className="relative">
            <div className="relative rounded-2xl bg-[#0f1115] border border-white/10 shadow-2xl overflow-hidden">
              {/* Fake Browser/Terminal Header */}
              <div className="flex items-center px-4 py-3 border-b border-white/5 bg-[#13151a]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>
                <div className="mx-auto flex items-center gap-2 px-3 py-1 rounded-md bg-black/20 border border-white/5 text-[10px] text-gray-500 font-mono">
                  <Search className="w-3 h-3" />
                  Impact of quantum computing on cryptography...
                </div>
              </div>

              {/* Chat Content */}
              <div className="p-6 space-y-6 font-mono text-sm">
                {/* Sources */}
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-wider text-gray-600 font-semibold">
                    Sources
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['MIT Tech Review', 'Nature Journal', 'IBM Research'].map((src, i) => <div key={i} className="bg-white/5 border border-white/5 rounded p-2">
                          <div className="w-4 h-4 rounded bg-indigo-500/20 mb-2" />
                          <div className="text-[10px] text-gray-400 truncate">
                            {src}
                          </div>
                        </div>)}
                  </div>
                </div>

                {/* Answer */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-600 font-semibold">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    Answer
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Quantum computing poses a{' '}
                    <span className="text-white font-medium">
                      significant threat
                    </span>{' '}
                    to current cryptographic standards, particularly RSA and
                    ECC. Shor's algorithm demonstrates that a sufficiently
                    powerful quantum computer could factor large integers
                    efficiently.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    In response, the NIST has been evaluating{' '}
                    <span className="text-indigo-300">
                      post-quantum cryptography (PQC)
                    </span>{' '}
                    algorithms. The transition is expected to take decades, but
                    immediate action is recommended for sensitive data with long
                    lifespans.
                  </p>
                  <div className="h-4 w-2 bg-indigo-500 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Decorative glow behind card */}
            <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl -z-10 rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>;
}
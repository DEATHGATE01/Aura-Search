import React from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Globe } from 'lucide-react';
export function DemoPreview() {
  return <section className="py-24 bg-[#0a0a0f] overflow-hidden">
      <div className="container px-4 mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.8
      }} className="relative max-w-5xl mx-auto">
          <div className="rounded-xl bg-[#0f1115] border border-white/10 shadow-2xl overflow-hidden min-h-[600px]">
            {/* Sidebar Mockup */}
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-[#0a0a0f] border-r border-white/5 hidden md:block p-4">
              <div className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                Library
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-white bg-white/5 p-2 rounded">
                  <div className="w-2 h-2 border border-white/40 rounded-sm" />
                  Top sci-fi books 2024
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 p-2">
                  <div className="w-2 h-2 border border-white/20 rounded-sm" />
                  React vs Vue performance
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 p-2">
                  <div className="w-2 h-2 border border-white/20 rounded-sm" />
                  History of coffee beans
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="md:ml-64 p-8">
              {/* Search Query */}
              <div className="flex gap-2 mb-8">
                <div className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/20">
                  Research
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs font-medium border border-white/5">
                  Academic
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs font-medium border border-white/5">
                  Coding
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-8">
                Best science fiction novels released in 2024?
              </h2>

              {/* Sources */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[{
                title: 'Goodreads',
                domain: 'goodreads.com'
              }, {
                title: 'The Verge',
                domain: 'theverge.com'
              }, {
                title: 'Polygon',
                domain: 'polygon.com'
              }].map((src, i) => <div key={i} className="bg-[#13151a] border border-white/5 p-3 rounded-lg">
                    <div className="font-semibold text-white text-xs mb-1">
                      {src.title}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {src.domain}
                    </div>
                  </div>)}
              </div>

              {/* Answer Text */}
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  Several highly anticipated science fiction novels have been
                  released in 2024. Notable titles include{' '}
                  <strong className="text-white">"The Mercy of Gods"</strong> by
                  James S.A. Corey, which begins a new space opera trilogy
                  following the success of The Expanse{' '}
                  <sup className="text-indigo-400">1</sup>.
                </p>
                <p>
                  Another standout is{' '}
                  <strong className="text-white">"Orbital"</strong> by Samantha
                  Harvey, which offers a meditative look at life aboard the ISS.
                  For fans of cyberpunk,{' '}
                  <strong className="text-white">"Neuromancer"</strong> saw a
                  40th-anniversary discussion, but new entries like{' '}
                  <strong className="text-white">"Service Model"</strong> by
                  Adrian Tchaikovsky explore robotic sentience in unique ways{' '}
                  <sup className="text-indigo-400">2</sup>.
                </p>
              </div>
            </div>
          </div>

          {/* Glow behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-500/5 blur-[120px] -z-10 rounded-full" />
        </motion.div>
      </div>
    </section>;
}
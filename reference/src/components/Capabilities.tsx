import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
const capabilities = [{
  title: 'Academic Research',
  items: ['Citation formatting', 'Peer-reviewed sources', 'Data synthesis', 'PDF analysis']
}, {
  title: 'Market Analysis',
  items: ['Competitor tracking', 'Trend identification', 'News aggregation', 'Financial data']
}, {
  title: 'Coding Assistant',
  items: ['Code explanation', 'Debugging help', 'Documentation search', 'Best practices']
}, {
  title: 'Creative Writing',
  items: ['Idea generation', 'Fact checking', 'Style adaptation', 'Content outlining']
}];
export function Capabilities() {
  return <section className="py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Built for every <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                knowledge worker
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Whether you're writing a thesis, analyzing market trends, or
              debugging code, Aura adapts to your specific needs with
              specialized models and search strategies.
            </p>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20">
              <div className="text-4xl font-bold text-white mb-2">10x</div>
              <div className="text-indigo-200">
                Faster research completion compared to traditional search
                engines.
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {capabilities.map((cap, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                <h3 className="text-lg font-bold text-white mb-4">
                  {cap.title}
                </h3>
                <ul className="space-y-3">
                  {cap.items.map((item, i) => <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      {item}
                    </li>)}
                </ul>
              </motion.div>)}
          </div>
        </div>
      </div>
    </section>;
}
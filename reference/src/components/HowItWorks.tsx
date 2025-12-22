import React from 'react';
import { motion } from 'framer-motion';
const steps = [{
  number: '1',
  title: 'Ask anything',
  description: 'Type your question in natural language, just like asking an expert.'
}, {
  number: '2',
  title: 'Aura reads the web',
  description: 'Our AI scans dozens of trusted sources in real-time to find facts.'
}, {
  number: '3',
  title: 'Get the answer',
  description: 'Receive a comprehensive summary with citations and source links.'
}];
export function HowItWorks() {
  return <section className="py-24 bg-[#0a0a0f] border-t border-white/5">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            From curiosity to clarity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {steps.map((step, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.2,
          duration: 0.5
        }} className="relative flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#1a1d24] border border-white/10 flex items-center justify-center text-white font-bold mb-6 shadow-lg">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-400 leading-relaxed max-w-xs text-sm">
                {step.description}
              </p>
            </motion.div>)}
        </div>
      </div>
    </section>;
}
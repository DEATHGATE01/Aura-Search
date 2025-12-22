import React from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, FileText, Zap } from 'lucide-react';
const features = [{
  icon: Search,
  title: 'AI-Powered Search',
  description: 'Complex questions broken down into actionable queries automatically.'
}, {
  icon: Globe,
  title: 'Real-time Web',
  description: 'Access live data from the internet, not just training data from years ago.'
}, {
  icon: FileText,
  title: 'Inline Citations',
  description: 'Every claim is backed by a clickable source so you can verify the truth.'
}, {
  icon: Zap,
  title: 'Fast Streaming',
  description: "Answers start streaming instantly. No waiting for the 'thinking' spinner."
}];
export function Features() {
  return <section className="py-24 bg-[#0a0a0f]">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Deep research, simplified.
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Aura connects you to the world's knowledge without the noise of
            SEO-spam and ads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1,
          duration: 0.5
        }} className="p-6 rounded-xl bg-[#0f1115] border border-white/5 hover:border-white/10 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                <feature.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>)}
        </div>
      </div>
    </section>;
}
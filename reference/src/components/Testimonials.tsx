import React from 'react';
import { motion } from 'framer-motion';
const testimonials = [{
  quote: 'Turned my literature review time in half. The ability to get cited answers instantly instead of clicking through ten links is a game changer.',
  author: 'Sarah Jenkins',
  role: 'PhD Candidate',
  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80'
}, {
  quote: 'I use Aura for market research every day. It synthesizes complex reports into actionable summaries that I can trust.',
  author: 'Markus Chen',
  role: 'Product Manager',
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80'
}, {
  quote: 'Fact-checking is effortless with the inline citations. It feels like having a research assistant who never sleeps.',
  author: 'Elena Rodriguez',
  role: 'Journalist',
  image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80'
}];
export function Testimonials() {
  return <section className="py-24 bg-[#0a0a0f]">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by the curious
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }} className="p-6 rounded-xl bg-[#0f1115] border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <img src={t.image} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="text-white font-medium text-sm">
                    {t.author}
                  </div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                "{t.quote}"
              </p>
            </motion.div>)}
        </div>
      </div>
    </section>;
}
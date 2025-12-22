import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
export function CTASection() {
  return <section className="py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-background pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 px-4 mx-auto text-center">
        <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} whileInView={{
        opacity: 1,
        scale: 1
      }} viewport={{
        once: true
      }} className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Ready to reimagine <br />
            how you research?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of researchers, developers, and students using Aura
            to find answers faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/search" className="w-full sm:w-auto">
              <Button size="lg" className="w-full px-8 h-14 text-lg">
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 h-14 text-lg">
              Contact Sales
            </Button>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            No credit card required. Free plan available forever.
          </p>
        </motion.div>
      </div>
    </section>;
}
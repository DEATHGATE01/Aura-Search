'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-indigo-500/30">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5 py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container px-4 mx-auto flex items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              How it works
            </a>
            <a
              href="#"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Use cases
            </a>
            <a
              href="#"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Pricing
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              Log In
            </Button>
            <Link href="/chat">
              <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#0a0a0f] pt-24 px-4 md:hidden">
          <nav className="flex flex-col gap-6 text-center">
            <a href="#features" className="text-xl font-medium text-white">
              Features
            </a>
            <a href="#how-it-works" className="text-xl font-medium text-white">
              How it Works
            </a>
            <a href="#" className="text-xl font-medium text-white">
              Pricing
            </a>
            <hr className="border-white/10" />
            <Button variant="ghost" className="w-full">
              Log In
            </Button>
            <Link href="/chat" className="w-full">
              <Button className="w-full bg-white text-black">Get Started Free</Button>
            </Link>
          </nav>
        </div>
      )}

      <main>
        <Hero />
        <div id="features">
          <Features />
        </div>
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

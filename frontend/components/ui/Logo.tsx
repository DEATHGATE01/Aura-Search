'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = 'w-8 h-8', showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-50 rounded-full" />
        <Sparkles className={cn('relative text-indigo-400', className)} />
      </div>
      {showText && (
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
          Aura
        </span>
      )}
    </div>
  );
}

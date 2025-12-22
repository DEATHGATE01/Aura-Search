import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}
// Using Framer Motion's motion.button for built-in animation capabilities
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  asChild = false,
  ...props
}, ref) => {
  const variants = {
    primary: 'bg-white text-black hover:bg-gray-200 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-sm',
    outline: 'bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white/40',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
  };
  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg'
  };
  return <motion.button ref={ref} whileHover={{
    scale: 1.02
  }} whileTap={{
    scale: 0.98
  }} className={cn('inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', variants[variant], sizes[size], className)} {...props as HTMLMotionProps<'button'>} />;
});
Button.displayName = 'Button';
export { Button };
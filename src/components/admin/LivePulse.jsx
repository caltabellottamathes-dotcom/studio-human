import React from 'react';
import { motion } from 'framer-motion';

export default function LivePulse({ className = '' }) {
  return (
    <span className={`relative flex w-2.5 h-2.5 ${className}`} aria-hidden>
      <motion.span
        className="absolute inset-0 rounded-full bg-red-500/60"
        animate={{ scale: [1, 2], opacity: [0.7, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
      />
      <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-red-500" />
    </span>
  );
}
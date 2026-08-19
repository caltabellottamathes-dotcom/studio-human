import React from 'react';
import { motion } from 'framer-motion';

export default function Marquee({ children, className = '', speed = 30 }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>{children}</div>
      </motion.div>
    </div>
  );
}
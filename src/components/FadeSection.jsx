import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1];

const initialStyles = {
  up: { opacity: 0, y: 32 },
  down: { opacity: 0, y: -32 },
  left: { opacity: 0, x: 40 },
  right: { opacity: 0, x: -40 },
  scale: { opacity: 0, scale: 0.95 },
};

export default function FadeSection({ children, className, delay = 0, variant = 'up' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const initial = initialStyles[variant] || initialStyles.up;
  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0, scale: 1 } : initial}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
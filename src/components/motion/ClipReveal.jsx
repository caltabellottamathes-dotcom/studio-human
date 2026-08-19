import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1];

export default function ClipReveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={inView ? { clipPath: 'inset(0 0 0% 0)' } : {}}
        transition={{ duration: 1, delay, ease }}
      >
        <motion.div
          initial={{ scale: 1.2 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 1.4, delay, ease }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
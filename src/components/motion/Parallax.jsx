import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Parallax({ children, className, speed = 30 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
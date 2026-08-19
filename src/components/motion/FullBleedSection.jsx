import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1];

export default function FullBleedSection({
  src,
  alt = '',
  className = '',
  minHeight = '70vh',
  parallaxSpeed = 60,
  overlay = 'bg-black/35',
  children,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [parallaxSpeed, -parallaxSpeed]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);

  return (
    <section ref={ref} className={`relative w-full overflow-hidden ${className}`} style={{ minHeight }}>
      <motion.div
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={inView ? { clipPath: 'inset(0 0 0% 0)' } : {}}
        transition={{ duration: 1.2, ease }}
        className="absolute inset-0"
      >
        <motion.img
          src={src}
          alt={alt}
          style={{ y, scale }}
          className="absolute -top-[12.5%] left-0 w-full h-[125%] object-cover"
        />
        {overlay && <div className={`absolute inset-0 ${overlay}`} />}
      </motion.div>
      <div className="relative z-10 h-full flex items-center" style={{ minHeight }}>
        {children}
      </div>
    </section>
  );
}
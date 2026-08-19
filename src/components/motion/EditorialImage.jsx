import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1];

const aspectMap = {
  '4/5': 'aspect-[4/5]',
  '3/4': 'aspect-[3/4]',
  '16/9': 'aspect-[16/9]',
  '3/2': 'aspect-[3/2]',
  '1/1': 'aspect-square',
  '2/3': 'aspect-[2/3]',
  '5/3': 'aspect-[5/3]',
  '5/4': 'aspect-[5/4]',
  '5/6': 'aspect-[5/6]',
  '3/5': 'aspect-[3/5]',
};

export default function EditorialImage({
  src,
  alt = '',
  className = '',
  aspect = '4/5',
  parallax = true,
  parallaxSpeed = 40,
  hoverZoom = true,
  children,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [parallaxSpeed, -parallaxSpeed]);

  const aspectClass = aspectMap[aspect] || aspectMap['4/5'];

  return (
    <div ref={ref} className={`relative overflow-hidden ${aspectClass} ${className}`}>
      <motion.div
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={inView ? { clipPath: 'inset(0 0 0% 0)' } : {}}
        transition={{ duration: 1, ease }}
        className="absolute inset-0"
      >
        <motion.img
          src={src}
          alt={alt}
          style={parallax ? { y } : {}}
          className={`absolute -top-[12.5%] left-0 w-full h-[125%] object-cover ${hoverZoom ? 'transition-transform duration-[1.2s] ease-out hover:scale-105' : ''}`}
        />
      </motion.div>
      {children}
    </div>
  );
}
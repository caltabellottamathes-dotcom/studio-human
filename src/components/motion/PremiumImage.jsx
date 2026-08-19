import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const roundedMap = {
  bl: 'rounded-bl-[3rem] md:rounded-bl-[14rem]',
  br: 'rounded-br-[3rem] md:rounded-br-[14rem]',
  tl: 'rounded-tl-[3rem] md:rounded-tl-[14rem]',
  tr: 'rounded-tr-[3rem] md:rounded-tr-[14rem]',
};

export default function PremiumImage({ src, alt = '', height = '70vh', rounded = 'bl', className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.04, 1.08]);

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: 'inset(8% 0 8% 0 round 0px)', opacity: 0 }}
      whileInView={{ clipPath: 'inset(0% 0 0% 0 round 0px)', opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative overflow-hidden premium-image ${roundedMap[rounded] || ''} ${className}`}
      style={{ height }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </motion.div>
  );
}
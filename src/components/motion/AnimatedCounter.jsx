import React, { useRef, useEffect, useState } from 'react';
import { useInView, animate } from 'framer-motion';

export default function AnimatedCounter({ to, suffix = '', prefix = '', className, duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return <span ref={ref} className={className}>{prefix}{display}{suffix}</span>;
}
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  const dotXSpring = useSpring(dotX, { damping: 30, stiffness: 600, mass: 0.3 });
  const dotYSpring = useSpring(dotY, { damping: 30, stiffness: 600, mass: 0.3 });
  const ringXSpring = useSpring(ringX, { damping: 18, stiffness: 180, mass: 0.6 });
  const ringYSpring = useSpring(ringY, { damping: 18, stiffness: 180, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
    document.body.style.cursor = 'none';

    const move = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      const el = e.target;
      setIsPointer(!!el.closest('a, button, [role="button"], input, textarea, select, label'));
    };

    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      document.body.style.cursor = '';
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        style={{ x: ringXSpring, y: ringYSpring }}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
      >
        <motion.div
          animate={{ scale: isPointer ? 1.6 : 1, opacity: isPointer ? 0.7 : 0.35 }}
          transition={{ duration: 0.25 }}
          className="-translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-red-600"
          style={{ boxShadow: '0 0 20px rgba(193, 6, 0, 0.12), inset 0 0 12px rgba(193, 6, 0, 0.06)' }}
        />
      </motion.div>
      <motion.div
        style={{ x: dotXSpring, y: dotYSpring }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
      >
        <motion.div
          animate={{ scale: isPointer ? 0.5 : 1 }}
          transition={{ duration: 0.25 }}
          className="-translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #ff4438, #c10600, #870400, #ff4438)',
            backgroundSize: '300% 300%',
            animation: 'cursor-gradient 2s ease infinite',
            boxShadow: '0 0 14px rgba(193, 6, 0, 0.55)',
          }}
        />
      </motion.div>
    </>
  );
}
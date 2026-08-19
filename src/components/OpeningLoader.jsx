import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1];

export default function OpeningLoader() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem('opening-seen'));

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('opening-seen', 'true');
    }, 1400);
    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
          className="fixed inset-0 z-[9999] bg-neutral-50 flex flex-col items-center justify-center gap-5"
        >
          <motion.span
            initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="font-serif text-2xl md:text-3xl lowercase tracking-normal text-neutral-800"
          >
            amorvitae.
          </motion.span>
          <motion.span
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease, delay: 0.3 }}
            className="h-px w-16 bg-red-600/30 origin-center"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
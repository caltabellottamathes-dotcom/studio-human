import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1];
const MIN_DISPLAY = 1100;
const MAX_WAIT = 5000;

export default function OpeningLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = 'hidden';
    const start = Date.now();
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      const delay = Math.max(0, MIN_DISPLAY - (Date.now() - start));
      window.setTimeout(() => setVisible(false), delay);
    };

    const attachVideo = (v) => {
      if (!v || v.readyState >= 2) { finish(); return; }
      v.addEventListener('loadeddata', finish, { once: true });
      v.addEventListener('canplay', finish, { once: true });
      v.addEventListener('error', finish, { once: true });
    };

    // The app dispatches 'app-ready' once auth + public settings have resolved
    // and real content is about to render. If the page has a hero video, we then
    // also wait for its first frame before revealing.
    const onAppReady = () => {
      const v = document.querySelector('video');
      if (v && v.readyState < 2) attachVideo(v);
      else finish();
    };

    window.addEventListener('app-ready', onAppReady, { once: true });
    // Fallback for routes without a video once the document is fully loaded.
    window.addEventListener('load', onAppReady, { once: true });
    if (document.readyState === 'complete') {
      // load already fired before this listener attached — defer one tick
      window.setTimeout(onAppReady, 0);
    }
    // Absolute safety net.
    const max = window.setTimeout(finish, MAX_WAIT);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('app-ready', onAppReady);
      window.removeEventListener('load', onAppReady);
      clearTimeout(max);
      const v = document.querySelector('video');
      if (v) {
        v.removeEventListener('loadeddata', finish);
        v.removeEventListener('canplay', finish);
        v.removeEventListener('error', finish);
      }
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
            className="font-serif text-2xl md:text-3xl tracking-tight text-neutral-800"
          >
            studioHuman
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
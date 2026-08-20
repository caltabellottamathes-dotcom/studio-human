import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import AssessmentFlow from './AssessmentFlow';

const ease = [0.25, 0.1, 0.25, 1];

export default function AssessmentLightbox() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-zelfreflectie', handler);
    return () => window.removeEventListener('open-zelfreflectie', handler);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        >
          <div
            className="absolute inset-0 bg-neutral-50/50 backdrop-blur-2xl"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            transition={{ duration: 0.45, ease }}
            className="relative bg-white/30 backdrop-blur-2xl rounded-[2rem] md:rounded-[3rem] max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl shadow-neutral-900/5 border border-red-600/15"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/40 backdrop-blur-md border border-neutral-200/40 flex items-center justify-center text-neutral-500 hover:text-red-600 hover:bg-white/60 transition-all duration-300"
              aria-label="Close"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <div className="p-6 md:p-10 pt-14 md:pt-16">
              <AssessmentFlow
                title={<>A quiet <span className="italic font-light text-red-600/90">self-reflection</span></>}
                description="Not sure where you stand? Take a few minutes to sit with this gentle reflection — not a diagnosis, just a mirror for what you feel."
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
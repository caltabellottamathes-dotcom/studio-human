import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left p-6 md:p-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/30 rounded-2xl"
        aria-expanded={open}
      >
        <span className="font-display text-lg md:text-xl text-neutral-800 pr-4">{item.q}</span>
        <span className={`w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 flex-shrink-0 transition-all duration-300 ${open ? 'rotate-180 bg-red-600 border-red-600 text-white' : ''}`}>
          <ChevronDown className="w-3.5 h-3.5" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 md:px-8 pb-6 md:pb-8 text-neutral-500 text-sm md:text-base font-light leading-normal">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
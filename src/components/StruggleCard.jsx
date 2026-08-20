import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const ease = [0.25, 0.1, 0.25, 1];

export default function StruggleCard({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease }}
    >
      <Link
        to={`/zorgvragen/${item.slug}`}
        className="group flex items-start gap-5 md:gap-8 py-7 md:py-8 border-b border-neutral-200 transition-colors duration-300 hover:border-neutral-300"
      >
        <span className="font-display italic text-red-600/30 text-xl md:text-2xl pt-1 tabular-nums group-hover:text-red-600/60 transition-colors duration-300 flex-shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="flex-1 max-w-xl">
          <h3 className="font-display text-2xl md:text-3xl text-neutral-800 group-hover:text-red-700 transition-colors duration-300 mb-1">
            {item.title}
          </h3>
          <p className="text-neutral-400 text-sm md:text-base font-light leading-relaxed group-hover:text-neutral-600 transition-colors duration-300">
            {item.desc}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-400 group-hover:text-red-600 transition-colors duration-300 mt-1 flex-shrink-0">
          Read more
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-all duration-300" strokeWidth={1.5} />
        </span>
      </Link>
    </motion.div>
  );
}
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useBeeldbank } from '@/lib/beeldbankContext';

const ease = [0.25, 0.1, 0.25, 1];

const imgRounded = {
  bl: 'rounded-bl-[3rem] md:rounded-bl-[14rem]',
  br: 'rounded-br-[3rem] md:rounded-br-[14rem]',
  tl: 'rounded-tl-[3rem] md:rounded-tl-[14rem]',
  tr: 'rounded-tr-[3rem] md:rounded-tr-[14rem]',
};

const panelTones = {
  glacier: 'bg-gradient-to-br from-red-100 via-red-200 to-cliff-100',
  cliff: 'bg-gradient-to-br from-cliff-100 via-cliff-200 to-red-100',
  ember: 'bg-gradient-to-br from-ember-100 via-ember-200 to-cliff-100',
  neutral: 'bg-gradient-to-br from-neutral-100 to-neutral-200',
};

const panelRounded = {
  bl: 'rounded-bl-[3rem] md:rounded-bl-[14rem] rounded-tl-xl rounded-tr-xl rounded-br-xl',
  br: 'rounded-br-[3rem] md:rounded-br-[14rem] rounded-tl-xl rounded-tr-xl rounded-bl-xl',
  tl: 'rounded-tl-[3rem] md:rounded-tl-[14rem] rounded-tr-xl rounded-br-xl rounded-bl-xl',
  tr: 'rounded-tr-[3rem] md:rounded-tr-[14rem] rounded-tl-xl rounded-br-xl rounded-bl-xl',
};

export default function EditableImage({ slotKey, alt = '', height = '70vh', rounded = 'bl', className = '' }) {
  const { mode, getSlot, openGallery } = useBeeldbank();
  const slot = getSlot(slotKey);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.04, 1.08]);

  const isImage = slot.type === 'image' && !!slot.url;
  const r = imgRounded[rounded] || '';
  const pr = panelRounded[rounded] || '';

  const renderImage = (h, cls) => (
    <motion.div
      ref={ref}
      initial={{ clipPath: 'inset(8% 0 8% 0 round 0px)', opacity: 0 }}
      whileInView={{ clipPath: 'inset(0% 0 0% 0 round 0px)', opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.1, ease }}
      className={`relative overflow-hidden premium-image ${r} ${cls}`}
      style={{ height: h }}
    >
      <motion.img src={slot.url} alt={alt} style={{ y, scale }} className="absolute inset-0 w-full h-full object-cover" />
    </motion.div>
  );

  const renderPanel = (h, cls) => (
    <div
      className={`relative w-full overflow-hidden ${panelTones[slot.tone] || panelTones.glacier} ${pr} ${cls}`}
      style={{ height: h }}
      aria-hidden
    />
  );

  if (!mode) {
    return isImage ? renderImage(height, className) : renderPanel(height, className);
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {isImage ? renderImage('100%', 'w-full h-full') : renderPanel('100%', 'w-full h-full')}
      <button
        type="button"
        onClick={() => openGallery()}
        className={`absolute inset-0 z-20 flex items-center justify-center bg-black/0 hover:bg-black/25 transition-colors group ${r}`}
        aria-label={`Edit image: ${slot.label}`}
      >
        <span className="pointer-events-none rounded-full bg-neutral-50/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-neutral-800 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
          {slot.label}
        </span>
      </button>
      <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full bg-neutral-900/75 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-neutral-50">
        {slot.type === 'image' ? 'Image' : 'Panel'}
      </span>
    </div>
  );
}
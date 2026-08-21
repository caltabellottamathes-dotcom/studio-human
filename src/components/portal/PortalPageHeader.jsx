import React from 'react';
import FadeSection from '@/components/FadeSection';

export default function PortalPageHeader({ label, title, sub, right }) {
  return (
    <FadeSection className="mb-8 md:mb-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-3">{label}</span>
          <h1 className="font-display text-4xl md:text-5xl text-neutral-800 tracking-tight leading-none">{title}</h1>
          {sub && <p className="text-neutral-500 font-light mt-3">{sub}</p>}
        </div>
        {right}
      </div>
    </FadeSection>
  );
}
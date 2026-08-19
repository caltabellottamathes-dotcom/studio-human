import React from 'react';
import { Link } from 'react-router-dom';
import FadeSection from '@/components/FadeSection';

export default function PageHeader({ label, title, intro, hideIntroMobile }) {
  return (
    <section className="pt-40 pb-20 px-6 md:px-12 max-w-[120rem] mx-auto">
      <FadeSection>
        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors mb-12 group">
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Terug naar home
        </Link>
        <span className="text-xs uppercase tracking-[0.25em] text-red-600/80 block label-line mb-6 font-medium">{label}</span>
        <h1 className="font-display text-5xl md:text-7xl text-neutral-800 leading-[1.1] tracking-tight mb-6 max-w-[18ch]">{title}</h1>
        {intro && <p className={`text-neutral-600 text-base md:text-lg font-light max-w-[44ch] leading-normal ${hideIntroMobile ? 'hidden md:block' : ''}`}>{intro}</p>}
      </FadeSection>
    </section>
  );
}
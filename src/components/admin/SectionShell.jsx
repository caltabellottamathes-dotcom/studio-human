import React from 'react';

export default function SectionShell({ title, label, sub, children, className = '' }) {
  return (
    <section className={`bg-white/60 border border-neutral-200/70 rounded-[1.5rem] p-6 md:p-8 h-full ${className}`}>
      <header className="flex items-end justify-between gap-4 mb-6 md:mb-8">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-600/70 block mb-2">{label}</span>
          <h2 className="font-display text-2xl md:text-3xl text-neutral-800 tracking-tight leading-none">{title}</h2>
        </div>
        {sub && (
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 text-right max-w-[22ch] hidden sm:block">
            {sub}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}
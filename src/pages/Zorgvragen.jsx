import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeSection from '@/components/FadeSection';
import StruggleCard from '@/components/StruggleCard';
import ClosingCTA from '@/components/ClosingCTA';
import CalmPanel from '@/components/CalmPanel';
import { struggles } from '@/data/content';

export default function Zorgvragen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem('zelfreflectie-zorgvragen-shown')) {
        sessionStorage.setItem('zelfreflectie-zorgvragen-shown', 'true');
        window.dispatchEvent(new CustomEvent('open-zelfreflectie'));
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-neutral-50 text-neutral-800 selection:bg-red-100 selection:text-red-900">
      <Header />

      {/* Title */}
      <section className="pt-40 pb-16 md:pb-20 px-6 md:px-12 max-w-[120rem] mx-auto">
        <FadeSection>
          <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors mb-12 group">
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            Back to home
          </Link>
          <span className="text-xs uppercase tracking-[0.25em] text-red-600/80 block label-line mb-6 font-medium">Concerns</span>
          <h1 className="font-display text-5xl md:text-7xl text-neutral-800 leading-[1.1] tracking-tight mb-6 max-w-[18ch]">
            What brings you <span className="italic font-light text-red-600/90">here</span>.
          </h1>
          <p className="text-neutral-600 text-base md:text-lg font-light max-w-[44ch] leading-normal">
            You don't need to name it precisely. These are common themes — not a checklist, not a diagnosis. Whatever you are carrying is welcome here.
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-zelfreflectie'))}
            className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors group"
          >
            Self-reflection
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
          </button>
        </FadeSection>
      </section>

      {/* Photo floating right with struggles flowing around */}
      <section className="px-6 md:px-12 max-w-[120rem] mx-auto pb-0 md:pb-16 relative z-0 flex flex-col md:block">
        <div className="md:float-right md:ml-8 lg:ml-12 md:-mr-12 md:w-[42%] lg:w-[38%] order-2 md:order-none -mb-40 md:-mb-72 relative z-0">
          <CalmPanel height="90vh" rounded="bl" tone="glacier" className="w-[60vw] ml-auto -mr-6 md:w-full md:ml-0 md:mx-0 mobile-h-tall" />
        </div>
        <div className="border-t border-neutral-200 order-1 md:order-none">
          {struggles.map((item, i) => (
            <StruggleCard key={item.slug} item={item} index={i} />
          ))}
        </div>
      </section>

      <ClosingCTA />

      <Footer />
    </div>
  );
}
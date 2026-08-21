import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import AssessmentLightbox from '@/components/assessment/AssessmentLightbox';
import BrandedButton from '@/components/BrandedButton';
import { useTier } from '@/hooks/useTier';
import { useBrand } from '@/hooks/useBrand';
import { useBeeldbank } from '@/lib/beeldbankContext';

const ease = [0.25, 0.1, 0.25, 1];

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Approach', to: '/approach' },
  { label: 'Concerns', to: '/concerns' },
  { label: 'About', to: '/about' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Contact', to: '/contact' },
];

export default function Footer() {
  const { portal: hasPortal, admin: hasAdmin } = useTier();
  const { name, contact, cta, legal } = useBrand();
  const { toggleMode, saving, dirtyCount } = useBeeldbank();
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease }}
      className="relative z-20 bg-white/5 backdrop-blur-md text-neutral-800 mx-4 md:mx-8 mb-4 md:mb-8 rounded-[1.5rem] md:rounded-[2rem] shadow-lg shadow-neutral-900/10 border border-red-600/20"
      role="contentinfo"
    >
      <div className="max-w-[120rem] mx-auto px-6 md:px-12 py-6 md:py-9">
        {/* Main composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Left: CTA top-left, portal links placed lower */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <BrandedButton to="/contact" compact>{cta.primary}</BrandedButton>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-zelfreflectie'))}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-red-600 transition-colors group w-fit py-1"
              >
                {cta.reflect}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </button>
              {hasPortal && (
                <Link
                  to="/portal/dashboard"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-red-600 transition-colors group w-fit py-1"
                >
                  Client portal
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                </Link>
              )}
            </div>
          </div>

          {/* Right: wordmark + catchphrase, tight composition */}
          <div className="md:col-span-7 md:text-right">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-3">{name}</span>
            <p className="font-display text-2xl md:text-[2rem] leading-[1.04] tracking-tight text-neutral-800">
              Sometimes,<br />
              moving forward<br />
              <span className="font-mono font-light text-red-600/90">starts with sitting still</span>.
            </p>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-6 md:mt-8 pt-5 border-t border-neutral-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-neutral-600 font-normal" aria-label="Footer navigation">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to} className="hover:text-red-600 transition-colors">{link.label}</Link>
            ))}
          </nav>
          <div className="flex flex-col gap-0.5 text-sm text-neutral-600 font-normal md:text-right">
            <span className="text-neutral-800">In person &amp; online</span>
            <a href={`mailto:${contact.email}`} className="hover:text-red-600 transition-colors">{contact.email}</a>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest">© {new Date().getFullYear()} {legal.copyrightEntity}</span>
          <div className="flex items-center gap-4">
            {hasAdmin && (
              <button
                type="button"
                onClick={toggleMode}
                disabled={saving}
                className="text-[10px] text-neutral-500 hover:text-red-600 transition-colors uppercase tracking-widest disabled:opacity-50"
              >
                {saving ? 'Saving…' : `Image bank${dirtyCount ? ` (${dirtyCount})` : ''}`}
              </button>
            )}
            {hasAdmin && <Link to="/admin/dashboard" className="text-[10px] text-neutral-500 hover:text-red-600 transition-colors uppercase tracking-widest">Admin</Link>}
          </div>
        </div>
      </div>
      <AssessmentLightbox />
    </motion.footer>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import AssessmentLightbox from '@/components/assessment/AssessmentLightbox';
import BrandedButton from '@/components/BrandedButton';

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
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease }}
      className="relative z-10 bg-white/10 backdrop-blur-2xl text-neutral-800 mx-4 md:mx-8 mt-12 md:mt-16 mb-4 md:mb-8 rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-neutral-900/5 border border-red-600/20"
      role="contentinfo"
    >
      <div className="max-w-[120rem] mx-auto px-6 md:px-12 py-6 md:py-14">
        <div className="mb-6 md:mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-red-600/80 block label-line mb-4 font-medium">studioHuman</span>
          <p className="font-display text-xl md:text-2xl text-neutral-800 leading-[1.1] tracking-tight max-w-[24ch]">
            Love for life, <span className="italic font-light text-red-600/90">care for the soul</span>.
          </p>
          <div className="mt-3 md:mt-4 flex flex-col gap-1 md:gap-2">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-zelfreflectie'))}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors group w-fit py-1.5"
            >
              Self-reflection
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </button>
            <Link
              to="/portal/dashboard"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors group w-fit py-1.5"
            >
              Client portal
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </Link>
          </div>
          <div className="mt-4 md:mt-6">
                        <BrandedButton to="/contact" compact>Book a session</BrandedButton>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-6">
          <nav className="flex flex-col gap-1 text-sm text-neutral-500 font-light w-fit" aria-label="Footer navigation">
            {navLinks.map(link => (
              <Link key={link.label} to={link.to} className="hover:text-red-600 transition-colors w-fit py-1">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-1 text-sm text-neutral-500 font-light md:text-right">
            <p className="text-neutral-700">14 Linden Walk, Portland</p>
            <a href="tel:+15035550142" className="hover:text-red-600 transition-colors py-1">+1 (503) 555 0142</a>
            <a href="mailto:hello@studiohuman.com" className="hover:text-red-600 transition-colors py-1">hello@studiohuman.com</a>
          </div>
        </div>

        <div className="mt-6 pt-4 md:mt-8 border-t border-neutral-200/60 flex items-center justify-between">
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest">© {new Date().getFullYear()} studioHuman</span>
          <Link to="/admin/dashboard" className="text-[10px] text-neutral-400 hover:text-red-600 transition-colors uppercase tracking-widest">Admin</Link>
        </div>
      </div>
      <AssessmentLightbox />
    </motion.footer>
  );
}
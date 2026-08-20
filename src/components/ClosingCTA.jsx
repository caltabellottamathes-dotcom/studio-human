import React from 'react';
import { motion } from 'framer-motion';
import BrandedButton from '@/components/BrandedButton';
import FadeSection from '@/components/FadeSection';

const ease = [0.25, 0.1, 0.25, 1];

export default function ClosingCTA({
  to = '/contact',
  label = 'Begin here',
  headline,
  sub,
  buttonText = 'Book a session',
}) {
  return (
    <section className="relative px-6 md:px-12 max-w-[120rem] mx-auto py-20 md:py-32 z-10">
      <FadeSection className="max-w-3xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
          className="text-xs uppercase tracking-[0.25em] text-red-600/80 block label-line mb-6 font-medium"
        >
          {label}
        </motion.span>
        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-neutral-800 leading-[1.05] tracking-tight mb-6">
          {headline || (
            <>
              You don't need to have it all{' '}
              <span className="italic font-light text-red-600/90">figured out</span>.
            </>
          )}
        </h2>
        {sub && (
          <p className="text-neutral-500 text-base md:text-lg font-light leading-relaxed max-w-[52ch] mx-auto mb-10">
            {sub}
          </p>
        )}
        {!sub && (
          <p className="text-neutral-500 text-base md:text-lg font-light leading-relaxed max-w-[52ch] mx-auto mb-10">
            A first conversation carries no obligation. Whenever you're ready, we'll begin — at your pace.
          </p>
        )}
        <div className="flex justify-center">
          <BrandedButton to={to}>{buttonText}</BrandedButton>
        </div>
      </FadeSection>
    </section>
  );
}
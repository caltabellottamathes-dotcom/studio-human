import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClosingCTA from '@/components/ClosingCTA';
import FadeSection from '@/components/FadeSection';
import PremiumImage from '@/components/motion/PremiumImage';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import { tarievenImg } from '@/data/content';

const tiers = [
  {
    category: 'Individual Guidance',
    tagline: 'Personalized one-on-one sessions, at your pace.',
    items: [
      { label: 'Practice session (60 min)', price: '$60' },
      { label: 'Home visit session (60 min)', price: '$65' },
      { label: 'Evening session (after 8pm), Sunday or holiday', price: '+$15 supplement' },
    ],
  },
  {
    category: 'Thematic Group Sessions',
    tagline: 'On request — grief, boundaries, caregiving, meaning, and more.',
    items: [
      { label: 'Group session (max. 10 participants)', price: '$150 / hour' },
    ],
  },
  {
    category: 'Additional Support',
    tagline: 'Only in combination with ongoing guidance.',
    items: [
      { label: 'File preparation for GP or care providers', price: '' },
      { label: 'Coordination meetings with specialists', price: '' },
      { label: 'Written communication for insurance / care facility', price: '' },
      { label: 'Rate per started 15 minutes', price: '$15' },
      { label: 'Hourly rate (from 60 min)', price: '$60' },
      { label: 'Fixed rate: file + consult (max. 1 hour)', price: '$55' },
    ],
    note: true,
  },
  {
    category: 'Home Visit Travel Costs',
    tagline: 'Travel included within the local region.',
    items: [
      { label: 'Within Portland / Lakeview', price: 'Included' },
      { label: 'Outside this area', price: 'On request' },
    ],
  },
];

export default function Pricing() {
  return (
    <div className="bg-neutral-50 text-neutral-800 selection:bg-red-100 selection:text-red-900">
      <Header />

      <section className="pt-40 pb-12 px-6 md:px-12 max-w-[120rem] mx-auto">
        <FadeSection>
          <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors mb-12 group">
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            Back to home
          </Link>
          <span className="text-xs uppercase tracking-[0.25em] text-red-600/80 block label-line mb-6">Transparent & honest</span>
          <h1 className="font-display text-5xl md:text-7xl text-neutral-800 leading-tight tracking-tight mb-6">
            Rates & <span className="italic font-light text-red-600/90">pricing</span>.
          </h1>
          <p className="text-neutral-600 text-base md:text-lg font-light max-w-[44ch] leading-normal">
            Care should be clear — including when it comes to cost. Below you'll find the different options and rates of my practice. Guidance can take place at my practice or at your home. Questions or want to align on something? Reach out — together we'll find what fits your situation.
          </p>
        </FadeSection>
      </section>

      <section className="px-6 md:px-12 max-w-[120rem] mx-auto pb-16">
        <StaggerGroup className="divide-y divide-neutral-200" stagger={0.12}>
          {tiers.map((tier) => (
            <StaggerItem key={tier.category}>
              <div className="py-8 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="col-span-1 md:col-span-4">
                  <h2 className="font-display text-xl md:text-2xl text-neutral-800 mb-1">{tier.category}</h2>
                  <p className="text-neutral-500 text-sm md:text-base font-light leading-normal mt-1">{tier.tagline}</p>
                  {tier.note && (
                    <p className="text-xs text-neutral-400 font-light mt-3 italic">Only available in combination with individual guidance.</p>
                  )}
                </div>
                <div className="col-span-1 md:col-start-6 md:col-span-7">
                  {tier.items.map((item, ii) => (
                    <div key={ii} className={`flex justify-between items-baseline py-3 ${ii < tier.items.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                      <span className="text-neutral-700 text-sm md:text-base font-light pr-6">{item.label}</span>
                      {item.price && (
                        <span className="text-red-600 font-display text-sm md:text-base flex-shrink-0">{item.price}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Closing text + vertical image behind footer */}
      <section className="relative px-6 md:px-12 max-w-[120rem] mx-auto z-0">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-[55%] flex items-center pb-12 md:pb-16">
            <FadeSection>
              <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">Transparency</span>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-snug">
                <span className="font-light text-red-600/90">Care should be clear</span> — including when it's about cost.
              </p>
            </FadeSection>
          </div>
          <div className="md:w-[42%] relative md:-mr-12 -mb-32 md:-mb-72 z-0 w-[52vw] -mr-6 ml-auto md:ml-0">
            <PremiumImage src={tarievenImg} alt="" height="85vh" rounded="tl" className="w-full mobile-h-closing" />
          </div>
        </div>
      </section>

      <ClosingCTA />

      <Footer />
    </div>
  );
}
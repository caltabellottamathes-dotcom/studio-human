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
    category: 'Individuele Begeleiding',
    tagline: 'Gepersonaliseerde één-op-éénsessies, op jouw tempo.',
    items: [
      { label: 'Sessie aan de praktijk (60 min)', price: '€60' },
      { label: 'Huisbezoek-sessie (60 min)', price: '€65' },
      { label: 'Avondsessie (na 20u), zondag of feestdag', price: '+€15 supplement' },
    ],
  },
  {
    category: 'Thematische Groepssessies',
    tagline: 'Op aanvraag — rouw, grenzen, mantelzorg, zingeving, en meer.',
    items: [
      { label: 'Groepssessie (max. 10 deelnemers)', price: '€150 / uur' },
    ],
  },
  {
    category: 'Bijkomende Ondersteuning',
    tagline: 'Enkel in combinatie met lopende begeleiding.',
    items: [
      { label: 'Dossiervoorbereiding voor huisarts of zorgverleners', price: '' },
      { label: 'Coördinatie-gesprekken met specialisten', price: '' },
      { label: 'Schriftelijke communicatie voor mutualiteit / zorginstelling', price: '' },
      { label: 'Tarief per begonnen 15 minuten', price: '€15' },
      { label: 'Uurtarief (vanaf 60 min)', price: '€60' },
      { label: 'Vast tarief: dossier + consult (max. 1 uur)', price: '€55' },
    ],
    note: true,
  },
  {
    category: 'Verplaatsingskosten Huisbezoek',
    tagline: 'Verplaatsing inbegrepen binnen de lokale regio.',
    items: [
      { label: 'Binnen Hasselt / Zonhoven', price: 'Inbegrepen' },
      { label: 'Buiten dit gebied', price: 'Op aanvraag' },
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
            Terug naar home
          </Link>
          <span className="text-xs uppercase tracking-[0.25em] text-red-600/80 block label-line mb-6">Transparant & Eerlijk</span>
          <h1 className="font-display text-5xl md:text-7xl text-neutral-800 leading-tight tracking-tight mb-6">
            Prijzen & <span className="italic font-light text-red-600/90">Tarieven</span>.
          </h1>
          <p className="text-neutral-600 text-base md:text-lg font-light max-w-[44ch] leading-normal">
            Zorg mag duidelijk zijn — ook als het om kosten gaat. Hieronder vind je de verschillende mogelijkheden en tarieven van mijn praktijk. Begeleiding kan in mijn praktijk of bij jou thuis. Vragen of iets afstemmen? Neem gerust contact op — we zoeken samen wat past bij jouw situatie.
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
                    <p className="text-xs text-neutral-400 font-light mt-3 italic">Enkel beschikbaar in combinatie met individuele begeleiding.</p>
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
              <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">Transparantie</span>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-snug">
                <span className="font-light text-red-600/90">Zorg moet helder zijn</span> — ook als het over kosten gaat.
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
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeSection from '@/components/FadeSection';
import PageHeader from '@/components/PageHeader';

import CalmPanel from '@/components/CalmPanel';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import { principles, steps } from '@/data/content';

export default function Aanpak() {
  return (
    <div className="bg-neutral-50 text-neutral-800 selection:bg-red-100 selection:text-red-900">
      <Header />

      <PageHeader
        label="Our approach"
        title={<>Sit. Blur. <span className="italic font-light text-red-600/90">Move</span>.</>}
        intro="At the heart of our method lies a simple dialectic: to move forward, you first need to sit down. From stillness, through the blur, toward deliberate momentum — at your own pace." />

      <section className="px-6 md:px-12 max-w-[120rem] mx-auto pb-20 md:pb-32">
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200" stagger={0.1}>
          {principles.map((p) => (
            <StaggerItem key={p.num}>
              <div className="group bg-neutral-50 hover:bg-white py-10 md:py-14 px-6 md:px-10 h-full transition-colors duration-300">
                <span className="font-display text-4xl md:text-6xl text-ember-500 leading-none block mb-6">{p.num}</span>
                <h3 className="font-display text-2xl md:text-3xl text-neutral-800 mb-3 md:mb-4">{p.title}</h3>
                <p className="text-neutral-500 text-base md:text-lg font-light leading-relaxed">{p.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="pt-4 pb-12 md:py-20 px-6 md:px-12 max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="col-span-1 md:col-span-5 md:col-start-1 order-2 md:order-1">
            <FadeSection>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-tight tracking-tight">
                Sometimes it is a clarifying conversation, sometimes practical support, sometimes simply <span className="italic font-light text-red-600/90">sitting down</span> together.
              </p>
            </FadeSection>
          </div>
          <div className="md:col-span-7 md:col-start-6 order-1 md:order-2 md:-mr-12">
            <CalmPanel height="52vh" rounded="bl" tone="glacier" className="w-full -mr-6 md:mx-0 mobile-h-xs" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 max-w-[120rem] mx-auto">
        <FadeSection className="max-w-2xl mx-auto mb-16 md:mb-24 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">The process</span>
          <h2 className="font-display text-3xl md:text-5xl text-neutral-800 tracking-tight">
            How we move <span className="italic font-light text-red-600/90">together</span>.
          </h2>
          <p className="text-neutral-500 text-base md:text-lg font-light mt-4">Four unhurried steps — from sitting down to moving forward.</p>
        </FadeSection>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-1/2 top-2 bottom-2 w-px bg-cliff-300 -translate-x-px hidden md:block" aria-hidden />

          <StaggerGroup className="space-y-12 md:space-y-20" stagger={0.12}>
            {steps.map((step, i) => (
              <StaggerItem key={step.num}>
                <div className="relative pl-10 md:pl-0 md:grid md:grid-cols-2 md:gap-16 md:items-center">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15, type: 'spring', stiffness: 200 }}
                    className="absolute left-2 md:left-1/2 top-1 -translate-x-1/2 w-3 h-3 rounded-full bg-red-600 ring-4 ring-neutral-50"
                    aria-hidden
                  />
                  <div className={i % 2 === 0 ? 'md:col-start-1 md:text-right' : 'md:col-start-2 md:row-start-1'}>
                    <span className="font-mono italic text-red-600 block mb-1 text-sm md:text-base">Step {step.num}</span>
                    <h3 className="font-display text-xl md:text-2xl text-neutral-800 mb-2">{step.title}</h3>
                    <p className="text-neutral-500 text-base md:text-lg font-light leading-normal">{step.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="relative px-6 md:px-12 max-w-[120rem] mx-auto z-0">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-[42%] relative md:-ml-12 -mb-32 md:-mb-72 z-0 w-[54vw] -ml-6 order-2 md:order-1">
            <CalmPanel height="90vh" rounded="tr" tone="cliff" className="w-full mobile-h-closing" />
          </div>
          <div className="md:w-[55%] flex items-center pb-12 md:pb-16 order-1 md:order-2">
            <FadeSection>
              <span className="text-xs uppercase tracking-[0.2em] text-red-600/80 block label-line mb-4">Momentum</span>
              <p className="font-display text-2xl md:text-4xl text-neutral-800 leading-snug">
                Momentum cannot be forced from exhaustion. We gather the strength and clarity in the pause — so that when you stand back up, you move with <span className="font-light text-red-600/90">deliberate, sustainable pace</span>.
              </p>
            </FadeSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}